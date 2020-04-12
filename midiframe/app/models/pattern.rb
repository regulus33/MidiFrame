# frozen_string_literal: true
class Pattern < ApplicationRecord

  CLOCK_SIGNALS_IN_1_BAR = 96 

  # ? To be joined as one entire project 
  has_one_attached :video

  belongs_to :project

  before_create :set_channel, :initialize_name , :initialize_step_length , :initialize_note_stamps , :initialize_order_in_sequence

  # ? after create since the values set above must be present 
  after_create :set_channel, :initialize_name 
 
  # all note numbers that we will support, normally there are 0-128 but Id rather keep things as simple as possible and ,ake the end result evenly divisible by twelve, which is how many notes we keep in our on screen keyboard 
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


  def create_clip 
  
    active_storage_video = @project.video
    # ! heads up, this 
    # ? construct a unique URL in the Temp Dir, based on the blob.key + filename, its a unique string we get for free
    project_video = Tempfile.new([active_storage_video.blob.filename, '.mp4'])
    # ? the final output url for the end result video, just using @pattern.id to ensure uniqueness event though Tempfile
    # .new already generates a unique url
    processed_video = Tempfile.new([active_storage_video.blob.filename + @pattern.id, '.mp4'])
    # ? open empty file url and insert downloaded file into the shell 
    File.open(project_video, 'wb') do |f|
      f.write(active_storage_video.download)
    end

    # ? oncreate ffmpeg instance will loop through its parent patterns recorded midi events and save them 
    ffmpeg = FfMpeg.new(pattern: self)
    # ? now we need to hydrate each command with the intended location of the processed video clip, but first we need 
    # ? to make the tempfiles where those will be, so lets create each one based on the pattern event names 
    # ? to do this we need to generate a bunch of tempfiles and make sure each reference will stay in memory? 
     # or we could self generate the urls and save themmmm. hmmmmm. Yes lets do that. 
    ffmpeg.
    
    self.video.attach(
      io: File.open(processed_video),
      filename: "#{video.blob.filename.base}.mp4",
      content_type: 'video/mp4'
    )

    File.delete(orig_video_tmpfile)
    File.delete(processed_video)
  
    
  end

end
