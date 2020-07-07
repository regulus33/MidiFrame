# frozen_string_literal: true

# Holds the midi data collected from recording a pattern, scene or clip from a groovebox or other midi device. 
# provides static information to the front end such as the number of clock signals it takes to reach the end of 
# a bar and a 3 dimensional array of octaves -> note display names paired with their midi protocol identifiers.  
# it also carries the high level instructions for how to create a rythmic video clip based on its own data by 
# interacting with the FfMpeg class.
class Pattern < ApplicationRecord

  CLOCK_SIGNALS_IN_1_BAR = 96 
  # ? name of midi notes signaling absolute beginning and end of a clip 
  START = "start"
  STOP = "stop"
  # ? To be joined as one entire project 
  has_one_attached :clip
  belongs_to :project

  before_create :set_initial_channel, :initialize_name , :initialize_step_length , :initialize_note_stamps , :initialize_order_in_sequence
  # ? after create since the values set above must be present 
  after_create :set_initial_channel, :initialize_name 
 
  # * all note numbers that we will support, normally there are 0-128 but Id rather keep things as simple as possible and ,ake the end result evenly divisible by twelve, which is how many notes we keep in our on screen keyboard 
  NOTES_GROUPED_IN_OCTAVES = 
  [
    [[0, "C0"],  [1, "C#0"],  [2, "D0"],  [3, "D#0"],  [4, "E0"],  [5, "F0"],  [6, "F#0"],  [7, "G0"],  [8, "G#0"], [9, "A0"],  [10, "A#0"], [11, "B0"]],
    [[12, "C1"], [13, "C#1"], [14, "D1"], [15, "D#1"], [16, "E1"], [17, "F1"], [18, "F#1"], [19, "G1"], [20, "G#1"],[21, "A1"], [22, "A#1"], [23, "B1"]],
    [[24, "C2"], [25, "C#2"], [26, "D2"], [27, "D#2"], [28, "E2"], [29, "F2"], [30, "F#2"], [31, "G2"], [32, "G#2"],[33, "A2"], [34, "A#2"], [35, "B2"]],
    [[36, "C3"], [37, "C#3"], [38, "D3"], [39, "D#3"], [40, "E3"], [41, "F3"], [42, "F#3"], [43, "G3"], [44, "G#3"],[45, "A3"], [46, "A#3"], [47, "B3"]],
    [[48, "C4"], [49, "C#4"], [50, "D4"], [51, "D#4"], [52, "E4"], [53, "F4"], [54, "F#4"], [55, "G4"], [56, "G#4"],[57, "A4"], [58, "A#4"], [59, "B4"]],
    [[60, "C5"], [61, "C#5"], [62, "D5"], [63, "D#5"], [64, "E5"], [65, "F5"], [66, "F#5"], [67, "G5"], [68, "G#5"],[69, "A5"], [70, "A#5"], [71, "B5"]],
    [[72, "C6"], [73, "C#6"], [74, "D6"], [75, "D#6"], [76, "E6"], [77, "F6"], [78, "F#6"], [79, "G6"], [80, "G#6"],[81, "A6"], [82, "A#6"], [83, "B6"]],
    [[84, "C7"], [85, "C#7"], [86, "D7"], [87, "D#7"], [88, "E7"], [89, "F7"], [90, "F#7"], [91, "G7"], [92, "G#7"],[93, "A7"], [94, "A#7"], [95, "B7"]],
    [[96, "C8"], [97, "C#8"], [98, "D8"], [99, "D#8"], [100, "E8"],[101, "F8"],[102, "F#8"],[103, "G8"],[104, "G#8"],[105, "A8"],[106, "A#8"],[107, "B8"]]
  ]
  # * hard coded note numbers to octave index, we can check 
  # we can check: data-patterns--keyboard-position="4" against midi incoming messages. 
  NOTES_IN_WHICH_OCTAVE_IDENTIFIER = {0=>0, 1=>0, 2=>0, 3=>0, 4=>0, 5=>0, 6=>0, 7=>0, 8=>0, 9=>0, 10=>0, 11=>0, 12=>1, 13=>1, 14=>1, 15=>1, 16=>1, 17=>1, 18=>1, 19=>1, 20=>1, 21=>1, 22=>1, 23=>1, 24=>2, 25=>2, 26=>2, 27=>2, 28=>2, 29=>2, 30=>2, 31=>2, 32=>2, 33=>2, 34=>2, 35=>2, 36=>3, 37=>3, 38=>3, 39=>3, 40=>3, 41=>3, 42=>3, 43=>3, 44=>3, 45=>3, 46=>3, 47=>3, 48=>4, 49=>4, 50=>4, 51=>4, 52=>4, 53=>4, 54=>4, 55=>4, 56=>4, 57=>4, 58=>4, 59=>4, 60=>5, 61=>5, 62=>5, 63=>5, 64=>5, 65=>5, 66=>5, 67=>5, 68=>5, 69=>5, 70=>5, 71=>5, 72=>6, 73=>6, 74=>6, 75=>6, 76=>6, 77=>6, 78=>6, 79=>6, 80=>6, 81=>6, 82=>6, 83=>6, 84=>7, 85=>7, 86=>7, 87=>7, 88=>7, 89=>7, 90=>7, 91=>7, 92=>7, 93=>7, 94=>7, 95=>7, 96=>8, 97=>8, 98=>8, 99=>8, 100=>8, 101=>8}
  
  # sets both total clock signals and step_length
  # purpose being that the JS recorder needs to know how many clock signals should pass before exit.
  def step_length_integer=(length)
    self.total_clock_signals = CLOCK_SIGNALS_IN_1_BAR * length.to_i  
    self.step_length = length
  end
 
  # set initial channel on insert so the front end has something to work with at the beginning
  def set_initial_channel 
    self.channel = 1  
  end

  # set initial pattern name on insert so the front end has something to work with at the beginning 
  def initialize_name  
    self.name = "new pattern"
  end

  # set step length to 4  on insert
  def initialize_step_length  
    self.step_length_integer = 4 
  end

  # set empty object to initialize @pattern with an object when on NEW. Otherwise nil errors for EDIT form reuse 
  def initialize_note_stamps
    self.note_stamps = {} if self.note_stamps.nil?
  end

  # avoiding nil errors in patterns/index for newly created with no val set yet, sort will fail
  def initialize_order_in_sequence  
    self.order_in_sequence = 1
  end

  # midi events array should be filtered when we update it. We pluck out the un-selected notes
  # and only save relevant notes. 
  def midi_events_array=(events)
    self.midi_events = remove_events_not_selected_by_user(calibrate_midi_event_time_stamps(events))
  end

  def remove_events_not_selected_by_user(events) 
    events.select{|e| self.note_stamps.keys.include?(e[:note].to_s) || [ START, STOP ].include?(e[:note])}
  end

  # make start time 0 and calibrate each successive event by subtracting original start time from their timestamp value
  # and saving the result. 
  def calibrate_midi_event_time_stamps(events) 
    start_time = events.find{|e|e["note"] == "start"}["timestamp"]
    events.map do |event|
      { note: event["note"], timestamp: event["timestamp"] - start_time }
    end
  end

  # false if no font attached to parent project
  def make_text?
    self.project.font.present? 
  end

  def assemble_pattern_video 
    master_video = self.project.video
    video_path = create_clip(type: Video::VISUAL)
    audio_path = create_clip(type: Video::AUDIO)
    output_path = "#{Rails.root}/tmp/#{master_video.clip.blob.key}_#{master_video.name.to_s}.#{master_video.file_extension}" 
    merge_audio_and_video(audio_path: audio_path, video_path: video_path, output_path: output_path)
    attach_video(processed_video: output_path)
    File.delete(output_path)
  end

  def determine_file_extension_of_auidio(audio_path)
    output = `ffprobe -v quiet -print_format json -show_streams -select_streams a #{audio_path}`
    output_extensions = {
      'aac' => 'm4a',
      'mp3' => 'mp3',
      'opus' => 'opus',
      'vorbis' => 'ogg'
    }
    extension_key = JSON.parse(output)["streams"].first["codec_name"]
    return output_extensions[extension_key]
  end

  # returns the processed video path
  def create_clip(type:) 
    # * 1.
    if(type == Video::VISUAL)
      active_storage_video = self.project.video.visual.clip 
    elsif(type == Video::AUDIO)
      active_storage_video = self.project.video.audio.clip 
    else 
      throw "Argument error, create_clip requires a type, VISUAL or AUDIO"
    end 
    
    source_file = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_#{active_storage_video.name.to_s}_#{type}.#{type == Video::VISUAL ? self.project.video.file_extension : 'wav'}"
    processed_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_#{self.project.id.to_s}-#{self.id.to_s}_#{type}.#{type == Video::VISUAL ? self.project.video.file_extension : 'wav'}"
    File.open(source_file, 'wb') do |f|
      f.write(active_storage_video.download)
    end
    # * 2. 
    ffmpeg = FfMpeg.create(
      pattern: self, 
      project_tempfile_url: source_file, 
      processed_tempfile_url: processed_video
    )
    ffmpeg.create_blueprints_for_slices
    ffmpeg.create_slices 
    # * 3.
    processed_video = generate_new_video_concat_file_path
    create_concat_file(name: generate_new_text_concat_file_path, concat_blue_prints: ffmpeg.pattern_concat_blueprints)
    concatenate_clips(path_to_input_text_file: generate_new_text_concat_file_path, processed_video: processed_video)
    
    if make_text? 
      # # clip file is already here
      # font_file_extension = self.project.font.file_extension
      # active_storage_font = self.project.font.file 
      # font_file_temp_path = "#{Rails.root}/tmp/#{active_storage_font.blob.key}_#{active_storage_font.name.to_s}#{font_file_extension}"
      # # * download the fontfile 
      # File.open(font_file_temp_path, 'wb') do |f|
      #   f.write(active_storage_font.download)
      # end
      # # output will be into the existing pattern video :)
      # # ADD fontfile temp path to this ff_mpeg instance 
      # ffmpeg.clip_tempfile_path = processed_video # *
      # ffmpeg.processed_tempfile_url = "#{Rails.root}/tmp/textified_video_#{active_storage_video.blob.key}_#{self.project.id.to_s}-#{self.id.to_s}.#{self.project.video.file_extension}"
      # # * now create an empty file there 
      # ffmpeg.font_tempfile_path = font_file_temp_path
      # ffmpeg.create_blueprints_for_text_drawings
      # ffmpeg.draw_texts
      # # TODO: attach the clip to the pattern 
      # attach_video(processed_video: ffmpeg.processed_tempfile_url)
      # # TODO: DELETE - the dl'ed font 
      # File.delete(font_file_temp_path)
    end

    ffmpeg.remove_clips_from_tempfile()
    File.delete(source_file)
    return  processed_video
  end

  private 

  def attach_video(processed_video:)
    self.clip.attach(
      io: File.open(processed_video),
      filename: "#{self.id.to_s}.#{self.project.video.file_extension}",
      content_type: self.project.video.clip.content_type
    )
  end

  def concatenate_clips(path_to_input_text_file:, processed_video:) 
    `ffmpeg -an -f concat -safe 0 -i #{path_to_input_text_file} -c copy #{processed_video}`
  end

  def generate_new_video_concat_file_path
    name = "joined_clips_#{self.id.to_s}"
    "#{Rails.root}/tmp/#{name}.#{self.project.video.file_extension}"
  end

  def create_concat_file(name:, concat_blue_prints:)  
    File.open(name, 'wb') do |f|
      f.write(concat_blue_prints)
    end
  end

  def generate_new_text_concat_file_path
   file_name = "concat_file" + self.id.to_s 
   "#{Rails.root}/tmp/#{file_name}.txt"
  end 

  def merge_audio_and_video(audio_path:, video_path:, output_path:) 
    `ffmpeg -i #{video_path} -i #{audio_path} -c:v copy -c:a aac #{output_path}`
  end

end
