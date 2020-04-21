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

  # ? events. 
  def prepare_clip_generation(project_path_tempfile)
  end

  def create_slices
    self.pattern_blueprints.each do |command|
      result = `#{command}`
      puts result
    end
  end 

  private 

  # ? for each event in the @pattern.note_stamps array, this method is fed an event   
  # ? the method will output a string that is meant to be executed as a system command 
  # ? which invokes the FFMPEG binary for clip slicing. 
  def generate_slice_blue_print(event:, next_event:)
    # ? ffmpeg -t requires seconds, its still very precise so we just convert 
    slice_duration = milliseconds_to_seconds(next_event["timestamp"] - event["timestamp"])
    "ffmpeg -an -y -ss #{timestamp_to_play_in_video event: event} -i #{self.project_tempfile_url} -t #{slice_duration} -c:v libx264 #{generate_unique_tempfile_clip_location_url(event["timestamp"])}"
  end

  def generate_concat_blueprint(event)
    "file '#{generate_unique_tempfile_clip_location_url(event["timestamp"])}'\n"
  end

  def timestamp_to_play_in_video(event:)
    self.pattern.note_stamps[event["note"].to_s]
  end

  def milliseconds_to_seconds(milliseconds)
    milliseconds / 1000 
  end

  # ? we need to create a unique but recallable url to extract these clips to, each slice command will export the
  # ? results of the command to a location in the slices
  def generate_unique_tempfile_clip_location_url(time_stamp)
    pattern = self.pattern.id
    project = self.pattern.project.id 
    # ! TODO: security/stability make this below hash thing based on user email to ensure uniqueness
    # project-id--pattern-id--event-time should be unique enough so just don't forget to check this/test before production
    "#{Rails.root}/tmp/#{project}-#{pattern}-#{remove_dots(time_stamp)}.mp4"
  end 

  # ? add the command to the blueprints array, we save it in this table to make it possible to run it 
  # ? in separate process for flexibility 
  def add_commands_to_pattern_blue_prints(blue_prints) 
    self.pattern_blueprints = blue_prints 
    self.save!
  end

  def add_commands_to_pattern_concat_blue_prints(concat_blue_prints) 
    self.pattern_concat_blueprints = concat_blue_prints 
    self.save!
  end

  # ? loop through each recorded midi_event and using its data (really all you need to care about is the time it occured)
  # ? we then save each of these commands to be run later 
  def loop_through_events_and_process_them(events:)     
    # ? for each event, get the start time and end time of a note by finding the event's timestamp
    pattern_blueprints = []  
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
      # insert the command 
      
    end
    add_commands_to_pattern_blue_prints(pattern_blueprints)
    add_commands_to_pattern_concat_blue_prints(pattern_concat_blueprints)
  end 

  def reached_the_last_event?(current_index:, array_length:)
    current_index + 1 == array_length 
  end 

  def remove_dots(string)
    string.to_s.gsub(".","")
  end

end
