class FfMpeg < ApplicationRecord

  PROJECT_TEMPFILE_PLACEHOLDER = "PROJECT_TEMPFILE_PLACEHOLDER"
  before_create :on_create 

  def on_create 
    events = self.pattern.events    
    loop_through_events_and_process_them(events)
  end

  def prepare_clip_generation(project_path_tempfile:, processed_path_tempfile:)
    hydrate_blueprint_commands_with_tempfile_file_paths(project_path_tempfile, processed_path_tempfile)
  end

  def create_slices
    self.pattern_blueprints.each do |command|
      result = `#{command}`
      puts result
    end
  end 

  private 

  def hydrate_blueprint_commands_with_tempfile_file_paths(project_path_tempfile:, processed_path_tempfile:)
    new_blue_prints = self.pattern_blueprints.map { |b| b.gsub(PROJECT_TEMPFILE_PLACEHOLDER, project_path_tempfile).gsub(PROCESSED_TEMPFILE_PLACEHOLDER, processed_path_tempfile) }
    self.pattern_blueprints = new_blue_prints 
    self.save! 
  end

  # ? for each event in the @pattern.note_stamps array, this method is fed an event   
  # ? the method will output a string that is meant to be executed as a system command 
  # ? which invokes the FFMPEG binary for clip slicing. 
  def generate_blue_print(event:, next_event:)
    slice_duration = next_event.timeStamp - event.timeStamp
    "ffmpeg -an -y -ss #{event.timeStamp} -i #{PROJECT_TEMPFILE_PLACEHOLDER} -t #{slice_duration} -c:v libx264 #{generate_unique_tempfile_clip_location_url(event.timeStamp)}"
  end

  def generate_unique_tempfile_clip_location_url(time_stamp)
    pattern = self.pattern.id
    project = self.pattern.project.id 
    # ! TODO: security/stability make this below hash thing based on user email to ensure uniqueness
    # project-id--pattern-id--event-time should be unique enough so just don't forget to check this/test before production
    "#{Rails.root}/tmp/#{project}-#{pattern}-#{time_stamp}.mp4"
  end 

  # ? add the command to the blueprints array, we save it in this table to make it possible to run it 
  # ? in separate process for flexibility 
  def add_a_command_to_pattern_blue_prints_array(blue_print) 
    # blue_prints = self.pattern_blueprints.dup
    # blue_prints << command 
    # self.pattern_blueprints = blue_prints
    self.blue_prints << blue_print
    self.save!
  end

  # ? loop through each recorded midi_event and using its data (really all you need to care about is the time it occured)
  # ? we then save each of these commands to be run later 
  def loop_through_events_and_process_them(events:)     
    # ? for each event, get the start time and end time of a note by finding the event's timestamp
    events.each_with_index do |event, index|
      
      next_event = events[index + 1] unless reached_the_last_event? current_index: index, array_length: events.length
      
      blue_print_to_add = generate_blue_print(event: event, next_event: next_event)
      
      add_a_command_to_pattern_blue_prints_array(blue_print_to_add)
    
    end
  end 

  def reached_the_last_event?(current_index:, array_length:)
    current_index + 1 == array_length 
  end 

end
