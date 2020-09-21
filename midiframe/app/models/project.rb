# frozen_string_literal: true

class Project < ApplicationRecord
  # for views for new projects with no autotune
  INITIAL_AUTOTUNE_ARGS = {
    f: false,
    fs: false,
    g: false,
    gs: false,
    a: false,
    as: false,
    b: false,
    c: false,
    cs: false,
    d: false,
    ds: false,
    e: false,
  }

  belongs_to :user
  belongs_to :video
  belongs_to :font, optional: true
  has_many :patterns

  validates :name, presence: true
  validates :bpm, presence: true

  def playback_video
    self.video.display_video.clip
  end

  # download og video master
  # copy the wav to temp
  # autotune that wav
  # attach that wav to the dl'ed video copy
  # attach the video to a master.autotuned
  def autotune_video
    video = self.video.clip
    file_extension = self.video.file_extension

    source_video = "#{Rails.root}/tmp/#{video.blob.key}_#{video.name.to_s}_tuned.#{file_extension}"
    source_audio = "#{Rails.root}/tmp/#{video.blob.key}_#{video.name.to_s}_tuned.#{Video::AUDIO_FILE_EXTENSION}"

    processed_audio = "#{Rails.root}/tmp/#{video.blob.key}_#{self.id.to_s}-#{self.id.to_s}_tuned.#{Video::AUDIO_FILE_EXTENSION}"
    processed_video = "#{Rails.root}/tmp/#{video.blob.key}_#{self.id.to_s}-#{self.id.to_s}_tuned.#{file_extension}"

    File.open(source_video, "wb") do |f|
      f.write(video.download)
    end

    # * copy the sound to a tmp file to supply to autotalent
    save_sound_command(original_video: source_video, sound_file: source_audio)
    # Usage: autotalent <in file> <out file> 0 0 0 0 0 0 0 0 0 0 0 0
    # * run the autotalent script on audio
    `#{autotalent_command(format_for_autotalent(self.autotune_args), source_audio, processed_audio)}`
    # * replace audio in video, outpus to processed_video path
    merge_audio_and_video(audio_path: processed_audio, video_path: source_video, output_path: processed_video)
    # video should be processed, attach to video file to active storage object
    attach_autotuned_audio(processed_audio: processed_audio)
    attach_autotuned_video(processed_video: processed_video)

    kill_files([source_video, processed_video, source_audio, processed_audio])
    return processed_video
  end

  def kill_files(files)
    files.each do |n|
      File.delete(n)
    end
  end

  # return auto args if present, else this has never been tuned, initialize data structure for views
  def get_autotune_args
    return self.autotune_args if self.autotune_args
    return Project::INITIAL_AUTOTUNE_ARGS
  end

  def autotune_args_set=(args)
    self.autotune_args = args
  end

  private

  def format_for_autotalent(args)
    new_args = {}
    args.keys.each do |r|
      new_args[r] = convert_bool_to_int(args[r])
    end
    new_args
  end

  def save_sound_command(original_video:, sound_file:)
    # `ffmpeg -i #{original_video} -vn -acodec copy #{sound_file}`
    `ffmpeg -i #{original_video} #{sound_file}`
  end

  def merge_audio_and_video(audio_path:, video_path:, output_path:)
    `ffmpeg -i #{video_path} -i #{audio_path} -c:v copy -map 0:v:0 -map 1:a:0 #{output_path}`
  end

  def attach_autotuned_audio(processed_audio:)
    self.video.audio.clip.attach(
      io: File.open(processed_audio),
      filename: "#{self.id.to_s}.#{Video::AUDIO_FILE_EXTENSION}",
      content_type: self.video.clip.content_type,
    )
  end

  #if not autotuned video yet, create one and attach it
  # else find it and replace the clip
  def attach_autotuned_video(processed_video:)
    existing_tuned = self.video.autotuned
    if existing_tuned
      existing_tuned.clip.attach(
        io: File.open(processed_video),
        filename: "#{self.id.to_s}.#{self.video.file_extension}",
        content_type: self.video.clip.content_type,
      )
    else
      new_tuned = Video.create!(user: self.user, role: Video::AUTOTUNED, parent_video: self.video)
      new_tuned.clip.attach(
        io: File.open(processed_video),
        filename: "#{self.id.to_s}.#{self.video.file_extension}",
        content_type: self.video.clip.content_type,
      )
    end
  end

  def convert_bool_to_int(bool)
    return 0 if bool
    -1
  end

  # TODO: how to add these to some kind of global config?
  def auto_talent_path
    if (Rails.env.development?)
      return "~/andrWert43h/tuner/tuner"
    end
    return "~/andrWert43h/tuner/tuner"
  end

  def autotalent_command(args, input, output)
    #  iNotes[0] = psAutotalent->m_pfKey[AT_A];
    #  iNotes[1] = psAutotalent->m_pfKey[AT_Bb];
    #  iNotes[2] = psAutotalent->m_pfKey[AT_B];
    #  iNotes[3] = psAutotalent->m_pfKey[AT_C];
    #  iNotes[4] = psAutotalent->m_pfKey[AT_Db];
    #  iNotes[5] = psAutotalent->m_pfKey[AT_D];
    #  iNotes[6] = psAutotalent->m_pfKey[AT_Eb];
    #  iNotes[7] = psAutotalent->m_pfKey[AT_E];
    #  iNotes[8] = psAutotalent->m_pfKey[AT_F];
    #  iNotes[9] = psAutotalent->m_pfKey[AT_Gb];
    #  iNotes[10] = psAutotalent->m_pfKey[AT_G];
    #  iNotes[11] = psAutotalent->m_pfKey[AT_Ab];
    args_string = "#{args["a"]} #{args["as"]} #{args["b"]} #{args["c"]} #{args["cs"]} #{args["d"]} #{args["ds"]} #{args["e"]} #{args["f"]} #{args["fs"]} #{args["g"]} #{args["gs"]}"
    "#{auto_talent_path} #{input} #{output} #{args_string}"
  end
end
