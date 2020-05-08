class FfMpeg < ApplicationRecord

  PROJECT_TEMPFILE_PLACEHOLDER = "PROJECT_TEMPFILE_PLACEHOLDER"

  belongs_to :pattern 
 
  # ? before insert record into db, we loop through the parent pattern's
  # ? events array and process the events into string instructions 
  def create_blueprints_for_slices  
    events = self.pattern.midi_events  
    # ? add to self.pattern_blueprints
    loop_through_events_and_process_them(events: events)
  end

  # * execute all ffmpeg slice commands (seeking)
  # ? https://trac.ffmpeg.org/wiki/Seeking
  def create_slices
    self.pattern_blueprints.each do |command|
      result = `#{command}`
      puts result
    end
  end 

  def remove_clips_from_tempfile 
    self.clip_filenames.each do |filename|
      puts "[ff_mpeg] deleting #{filename}"
      File.delete(filename)
    end
  end
  private 

  # ? for each event in the @pattern.note_stamps array, this method is fed an event   
  # ? the method will output a string that is meant to be executed as a system command 
  # ? which invokes the FFMPEG binary for clip slicing. 
  def generate_slice_blue_print(event:, next_event:)
    # ? ffmpeg -t requires seconds, its still very precise so we just convert 
    slice_duration = convert_seconds_to_milliseconds_and_convert_scientific_notation_to_strings(next_event["timestamp"] - event["timestamp"])
    "ffmpeg -an -y -ss #{timestamp_to_play_in_video(event: event)} -i #{self.project_tempfile_url} -t #{slice_duration} -c:v libx264 #{generate_unique_tempfile_clip_location_url(event["timestamp"])}"
  end

  def generate_concat_blueprint(event)
    "file '#{generate_unique_tempfile_clip_location_url(event["timestamp"])}'\n"
  end

  def timestamp_to_play_in_video(event:)
    note = event["note"]
    return 0.0 if note == "start"
    self.pattern.note_stamps[note.to_s]
  end

  # ?  sometimes x / 1000 gives you this: 0.8999998681247234e-4 and you need this:  "0.00008999998681247234"
  # ? its scientific notation and needs to be converted to a readbale string by ffmpeg 
  # https://stackoverflow.com/questions/8586357/how-to-convert-a-scientific-notation-string-to-decimal-notation
  def convert_seconds_to_milliseconds_and_convert_scientific_notation_to_strings(milliseconds)
    seconds = milliseconds / 1000 
    BigDecimal(seconds.to_s).to_s # ? returns a big decimal as a string 
  end

  # ? we need to create a unique but recallable url to extract these clips to, each slice command will export the
  # ? results of the command to a location in the slices
  def generate_unique_tempfile_clip_location_url(time_stamp)
    pattern = self.pattern.id
    project = self.pattern.project.id 
    # ! TODO: security/stability make this below hash thing based on user email to ensure uniqueness
    # project-id--pattern-id--event-time should be unique enough so just don't forget to check this/test before production
    "#{Rails.root}/tmp/#{project}_#{pattern}_#{time_stamp}.#{project.video.file_extension}"
  end 

  # ? add the command to the blueprints array, we save it in this table to make it possible to run it 
  # ? in separate process for flexibility 
  def save_and_add_commands_to_pattern_blue_prints(blue_prints) 
    self.pattern_blueprints = blue_prints 
    self.save!
  end

  def save_and_add_commands_to_pattern_concat_blue_prints(concat_blue_prints) 
    self.pattern_concat_blueprints = concat_blue_prints 
    self.save!
  end

  def save_and_add_clip_file_names_to_clip_filenames(filenames)
    self.clip_filenames = filenames
    self.save!
  end

  # ? loop through each recorded midi_event and using its data (really all you need to care about is the time it occured)
  # ? we then save each of these commands to be run later 
  def loop_through_events_and_process_them(events:)     
    # ? for each event, get the start time and end time of a note by finding the event's timestamp
    pattern_blueprints = []  
    clip_filenames = []
    pattern_concat_blueprints = ""
    events.each_with_index do |event, index|
      # ? stop is the last event, there is not command for this event, it only serves as a sign when the last note should terminate
      break if event["note"] == "stop"
      # ? calculate the end time of the note by searching starttime of next note 
      next_event = events[index + 1] unless reached_the_last_event? current_index: index, array_length: events.length
      # ? build the string to be run / insertted in out blueprints collection 
      blue_print_to_add = generate_slice_blue_print(event: event, next_event: next_event)
      concat_blue_print_to_add = generate_concat_blueprint(event)
      # ? COLLECT BLUEPRINTS FOR SLICE AND CONCAT 
      pattern_blueprints << blue_print_to_add
      pattern_concat_blueprints << concat_blue_print_to_add
      # ? need to save clip filenames to delete later 
      clip_filenames << generate_unique_tempfile_clip_location_url(event["timestamp"])
      # insert the command 
    end
    # *
    # *
    #      EVERYTHING YOU NEED TO SLICE CONCAT AND DELETE CLIPS  
    # *
    # *
    save_and_add_commands_to_pattern_blue_prints(pattern_blueprints)
    save_and_add_commands_to_pattern_concat_blue_prints(pattern_concat_blueprints)
    save_and_add_clip_file_names_to_clip_filenames(clip_filenames)
  end 

  def reached_the_last_event?(current_index:, array_length:)
    current_index + 1 == array_length 
  end 

  def remove_dots(string)
    string.to_s.gsub(".","")
  end

end
