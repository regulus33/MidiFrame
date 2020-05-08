# frozen_string_literal: true
class Pattern < ApplicationRecord

  CLOCK_SIGNALS_IN_1_BAR = 96 
  # ? name of midi notes signaling absolute beginning and end of a clip 
  START = "start"
  STOP = "stop"

  # ? To be joined as one entire project 
  has_one_attached :video

  belongs_to :project

  before_create :set_channel, :initialize_name , :initialize_step_length , :initialize_note_stamps , :initialize_order_in_sequence

  # ? after create since the values set above must be present 
  after_create :set_channel, :initialize_name 
 
  # * all note numbers that we will support, normally there are 0-128 but Id rather keep things as simple as possible and ,ake the end result evenly divisible by twelve, which is how many notes we keep in our on screen keyboard 
  NOTES_GROUPED_IN_OCTAVES = 
  [
    [[0, "C0"],  [1, "C#0"],  [2, "D0"],  [3, "D#0"],  [4, "E0"],  [5, "F0"],  [6, "F#0"],  [7, "G0"],  [8, "G#0"],  [9, "A0"],  [10, "A#0"], [11, "B0"]],
    [[12, "C1"], [13, "C#1"], [14, "D1"], [15, "D#1"], [16, "E1"], [17, "F1"], [18, "F#1"], [19, "G1"], [20, "G#1"], [21, "A1"], [22, "A#1"], [23, "B1"]],
    [[24, "C2"], [25, "C#2"], [26, "D2"], [27, "D#2"], [28, "E2"], [29, "F2"], [30, "F#2"], [31, "G2"], [32, "G#2"], [33, "A2"], [34, "A#2"], [35, "B2"]],
    [[36, "C3"], [37, "C#3"], [38, "D3"], [39, "D#3"], [40, "E3"], [41, "F3"], [42, "F#3"], [43, "G3"], [44, "G#3"], [45, "A3"], [46, "A#3"], [47, "B3"]],
    [[48, "C4"], [49, "C#4"], [50, "D4"], [51, "D#4"], [52, "E4"], [53, "F4"], [54, "F#4"], [55, "G4"], [56, "G#4"], [57, "A4"], [58, "A#4"], [59, "B4"]],
    [[60, "C5"], [61, "C#5"], [62, "D5"], [63, "D#5"], [64, "E5"], [65, "F5"], [66, "F#5"], [67, "G5"], [68, "G#5"], [69, "A5"], [70, "A#5"], [71, "B5"]],
    [[72, "C6"], [73, "C#6"], [74, "D6"], [75, "D#6"], [76, "E6"], [77, "F6"], [78, "F#6"], [79, "G6"], [80, "G#6"], [81, "A6"], [82, "A#6"], [83, "B6"]],
    [[84, "C7"], [85, "C#7"], [86, "D7"], [87, "D#7"], [88, "E7"], [89, "F7"], [90, "F#7"], [91, "G7"], [92, "G#7"], [93, "A7"], [94, "A#7"], [95, "B7"]],
    [[96, "C8"], [97, "C#8"], [98, "D8"], [99, "D#8"], [100, "E8"],[101, "F8"],[102, "F#8"],[103, "G8"],[104, "G#8"],[105, "A8"],[106, "A#8"],[107, "B8"]]
  ]
  # * hard coded note numbers to octave index, we can check 
  # we can check: data-patterns--keyboard-position="4" against midi incoming messages. 
  NOTES_IN_WHICH_OCTAVE_IDENTIFIER = {0=>0, 1=>0, 2=>0, 3=>0, 4=>0, 5=>0, 6=>0, 7=>0, 8=>0, 9=>0, 10=>0, 11=>0, 12=>1, 13=>1, 14=>1, 15=>1, 16=>1, 17=>1, 18=>1, 19=>1, 20=>1, 21=>1, 22=>1, 23=>1, 24=>2, 25=>2, 26=>2, 27=>2, 28=>2, 29=>2, 30=>2, 31=>2, 32=>2, 33=>2, 34=>2, 35=>2, 36=>3, 37=>3, 38=>3, 39=>3, 40=>3, 41=>3, 42=>3, 43=>3, 44=>3, 45=>3, 46=>3, 47=>3, 48=>4, 49=>4, 50=>4, 51=>4, 52=>4, 53=>4, 54=>4, 55=>4, 56=>4, 57=>4, 58=>4, 59=>4, 60=>5, 61=>5, 62=>5, 63=>5, 64=>5, 65=>5, 66=>5, 67=>5, 68=>5, 69=>5, 70=>5, 71=>5, 72=>6, 73=>6, 74=>6, 75=>6, 76=>6, 77=>6, 78=>6, 79=>6, 80=>6, 81=>6, 82=>6, 83=>6, 84=>7, 85=>7, 86=>7, 87=>7, 88=>7, 89=>7, 90=>7, 91=>7, 92=>7, 93=>7, 94=>7, 95=>7, 96=>8, 97=>8, 98=>8, 99=>8, 100=>8, 101=>8}

  def step_length_integer=(length)
    self.total_clock_signals = CLOCK_SIGNALS_IN_1_BAR * length.to_i  
    self.step_length = length
  end

  def set_channel 
    self.channel = 1  
  end

  def initialize_name  
    self.name = "new pattern"
  end

  def initialize_step_length  
    self.step_length_integer = 4 
  end

  # ? set empty object to initialize @pattern with an object when on NEW. Otherwise nil errors for EDIT form reuse 
  def initialize_note_stamps 
    self.note_stamps = {}
  end

  # ? as above, avoiding nil errors in patterns/index for newly created with no val set yet, sort will fail
  def initialize_order_in_sequence  
    self.order_in_sequence = 1
  end

  def midi_events_array=(events)
    self.midi_events = remove_events_not_selected_by_user(calibrate_midi_event_time_stamps(events))
  end

  def remove_events_not_selected_by_user(events) 
    events.select{|e| self.note_stamps.keys.include?(e[:note].to_s) || [ START, STOP ].include?(e[:note])}
  end

  # ? make start = 0 and subsequent events be something like 1,2,3 rather than 1111, 222, 3333
  def calibrate_midi_event_time_stamps(events) 
    start_time = events.find{|e|e["note"] == "start"}["timestamp"]
    events.map do |event|
      { note: event["note"], timestamp: event["timestamp"] - start_time }
    end
  end


  def create_clip 
    # ? get a reference to the parent video of this whole project 
    active_storage_video = self.project.video
    # ? construct a unique URL in the Temp Dir, based on the blob.key + filename, its a unique string we get for free
    project_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_#{active_storage_video.name.to_s}.#{self.project.video.file_extension}"
    # ? the final output url for the end result video, just using @pattern.id to ensure uniqueness nerve and talent 
    # .new already generates a unique url
    processed_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_#{self.project.id.to_s}-#{self.id.to_s}.#{self.project.video.file_extension}"
    # ? open empty file url and insert downloaded file into the shell 
    File.open(project_video, 'wb') do |f|
      f.write(active_storage_video.download)
    end
    # ? oncreate ffmpeg instance will loop through its parent patterns recorded midi events and save them 
    # ? FFMPEG object 
    #  pattern_blueprints:
    #   [
    #   ]
    # ? the pattern blueprints describe the action of chopping the video into little pieces 
    # ? we will also need to save pattern blueprints join 
    ffmpeg = FfMpeg.create(
      pattern: self, 
      project_tempfile_url: project_video, 
      processed_tempfile_url: processed_video
    )
    # ? create the slice commands then slice the video 
    ffmpeg.create_blueprints_for_slices
    ffmpeg.create_slices 
    # ? at this point because we have the slices made and existing in the temp directory
    # ? we also saved the absolute paths to these files into a jsonb field called pattern_concat_blueprints
    # ? we need to simply cat a txt file with a unique name specific to this pattern 
    processed_video = generate_new_video_concat_file_path
    create_concat_file(name: generate_new_text_concat_file_path, concat_blue_prints: ffmpeg.pattern_concat_blueprints)
    concatenate_clips(path_to_input_text_file: generate_new_text_concat_file_path, processed_video: processed_video)
    self.clip.attach(
      io: File.open(processed_video),
      filename: "#{self.id.to_s}.#{self.file_extension}",
      content_type: "video/#{self.file_extension}"
    )
    File.delete(project_video)
    File.delete(processed_video)
    ffmpeg.remove_clips_from_tempfile()
  end

  private 

  def concatenate_clips(path_to_input_text_file:, processed_video:) 
    `ffmpeg -an -f concat -safe 0 -i #{path_to_input_text_file} -c copy #{processed_video}`
  end

  def generate_new_video_concat_file_path
    name = "joined_clips_#{self.id.to_s}"
    "#{Rails.root}/tmp/#{name}.#{self..file_extension}"
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

end
