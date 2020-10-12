# frozen_string_literal: true
# for video download
require "net/http"
require "tempfile"
require "uri"

class Video < ApplicationRecord

  #will paginate limit
  self.per_page = 8

  MASTER = "MASTER"
  AUDIO = "AUDIO"
  VISUAL = "VISUAL"
  AUTOTUNED = "AUTOTUNED"

  has_many :projects
  # ! warning this after commit needs to be placed BEFORE the attachment delcarations
  # after_commit :handle_video_processing
  has_one_attached :clip
  has_one_attached :thumbnail
  belongs_to :user
  # TODO: VALIDATIONS
  ALLOWED_TYPES = %w[mp4 webm].freeze
  # TODO: validate video types! SECURITY
  ALLOWED_ROLES = [MASTER, AUDIO, VISUAL].freeze

  AUDIO_FILE_EXTENSION = "wav"

  belongs_to :parent_video, class_name: "Video", foreign_key: "parent_video_id", optional: true
  has_many :videos, class_name: "Video", foreign_key: "parent_video_id"

  scope :public_videos, -> { where(private: nil) }

  def file_extension
    return self.file_extension_string if self.file_extension_string.present?
    return clip.content_type.split("/").pop if clip.attached?
  end

  def master?
    self.role == MASTER
  end

  def visual
    if master?
      return self.videos.where(role: VISUAL).first
    end
    return nil
  end

  def audio
    if master?
      return self.videos.where(role: AUDIO).first
    end
    return nil
  end

  # public facing video, this is the video we can destructivly change, unlike master, this can always be the same
  def autotuned
    if master?
      self.videos.where(role: AUTOTUNED).first
    end
  end

  # if the user has autotuned a video, return the autotuned part, else return the master
  def display_video
    if self.master?
      tuned = self.videos.where(role: AUTOTUNED).first
      return tuned if tuned
      return self
    end
  end

  #download video from url
  def download_external_video
    video_file = "#{Dir.tmpdir}/#{self.id}.mp4"
    uri = URI.parse(self.url)
    resp = Net::HTTP.get_response(uri)

    File.open(video_file, "wb") do |f|
      f.write(resp.body)
    end
    filename = self.url.split("/").last
    self.clip.attach(
      io: File.open(video_file),
      filename: filename,
      content_type: "video",
    )
  end

  def create_video_formats
    save_master_video
    # ? get location of actual video
    active_storage_video = self.clip
    # ? construct a unique URL in the Temp Dir, based on the blob.key + filename, its a unique string we get for free
    original_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_original_video.#{self.file_extension}"
    File.open(original_video, "wb") do |f|
      f.write(active_storage_video.download)
    end
    # save meta information from this file
    save_metadata(original_video)
    save_thumbnail(original_video)
    # we grab the audio file's extension with ffrpobe from the video download above and pass to Video.create ONLY for audio
    # audio_file_extension = determine_file_extension_of_audio(original_video)
    # send it the reference to the local download of the original video
    audio_file_extension = AUDIO_FILE_EXTENSION
    save_sound_from_video(original_video: original_video, file_extension: audio_file_extension)
    save_soundless_video(original_video: original_video)
    # clean up the tempfile
    File.delete(original_video)
  end

  # save the mast   er video with role = 'master'
  # copy sound and save it as video of role = 'audio' and parent = master
  # copy the video without the sound and save it as role = 'visual'
  # when playing video, always play video where role = 'master'
  # when generating clips, always traverse from audio = project.video.video.where(role: 'audio') and video = project.video.video.where(role: 'video')
  # before attaching the result, merge the audio and video. Attach the result to pattern
  # DONE!

  # def determine_file_extension_of_audio(audio_path)
  #   output = `ffprobe -v quiet -print_format json -show_streams -select_streams a #{audio_path}`
  #   output_extensions = {
  #     'aac' => 'm4a',
  #     'mp3' => 'mp3',
  #     'opus' => 'opus',
  #     'vorbis' => 'ogg'
  #   }
  #   extension_key = JSON.parse(output)["streams"].first["codec_name"]
  #   return output_extensions[extension_key]
  # end

  def save_master_video
    self.role = MASTER
    self.save!
  end

  def content_type
    clip.content_type
  end

  # strips sound from video and returns the sound record
  def save_sound_from_video(original_video:, file_extension:)
    sound_from_video = "#{Rails.root}/tmp/#{self.clip.blob.key}_sound_from_video.#{file_extension}"

    result_of_command = save_sound_command(original_video: original_video, sound_file: sound_from_video)
    puts result_of_command
    sound_record = Video.create!(parent_video: self, user: self.user, role: AUDIO, file_extension_string: file_extension)
    sound_record.clip.attach(
      io: File.open(sound_from_video),
      filename: "#{self.clip.blob.filename.base}-sound.#{file_extension}",
      content_type: content_type,
    )
    File.delete(sound_from_video)
    sound_record
  end

  def save_soundless_video(original_video:)
    soundless_video = "#{Rails.root}/tmp/#{self.clip.blob.key}_soundless_video.#{self.file_extension}"
    strip_sound_command original_video: original_video, soundless_video: soundless_video
    # ! this is a lie since we don't really have the video attached yet
    soundless_video_record = Video.create!(parent_video: self, user: self.user, role: VISUAL)
    soundless_video_record.clip.attach(
      io: File.open(soundless_video),
      filename: "#{self.clip.blob.filename.base}-soundless.#{file_extension}",
      content_type: content_type,
    )
    File.delete(soundless_video)
  end

  # * not used at the moment
  def compress(new_project_to_add_output_to:)
    # ? get location of actual video
    active_storage_video = clip
    # ? construct a unique URL in the Temp Dir, based on the blob.key + filename, its a unique string we get for free
    original_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_original_video.#{self.file_extension}"
    webm_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_webm_video.webm"
    optimized_webm = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_optimized_webm_video.webm"
    # ? open empty file url and insert downloaded file into the shell
    File.open(original_video, "wb") do |f|
      f.write(active_storage_video.download)
    end
    # once we've dl'ed the video from the active storage server, we strip the sound
    run_compress original_video: original_video, webm_video: webm_video, optimized_video: optimized_webm
    web_video = Video.create(parent_video: self, role: "web", user: user)

    web_video.clip.attach(
      io: File.open(webm_video),
      filename: "#{active_storage_video.blob.filename.base}.webm",
      content_type: "video/webm",
    )
    web_video.save!
    @project = new_project_to_add_output_to
    @project.video = web_video
    @project.save!
    # =====================================
    File.delete(webm_video)
    File.delete(optimized_webm)
    File.delete(original_video)
  end

  private

  # save thumbnail
  def save_thumbnail(input_file)
    output_file = "#{Rails.root}/tmp/#{self.id}_thumb.jpg"
    random_timestamp = rand(1..duration)
    `ffmpeg -i #{input_file} -vframes 1 -an -s #{width}x#{height} -ss #{random_timestamp} #{output_file}`
    self.thumbnail.attach(
      io: File.open(output_file),
      filename: self.id,
      content_type: "image/jpeg",
    )
    # binding.pry
    File.delete(output_file)
  end

  def save_metadata(input_file)
    # ffprobe for duration, dimensions AND keyframes while we are at it!
    json_data = `ffprobe -v quiet -print_format json -show_format -show_streams #{input_file}`
    self.metadata = JSON.parse(json_data)
    self.keyframes = `ffprobe -loglevel error -select_streams v:0 -show_entries packet=pts_time,flags -of csv=print_section=0 #{input_file} | awk -F',' '/K/ {print $1}'`.split("\n")
  end

  def extract_image_command
    "ffmpeg -i test.mp4 -vframes 1 -an -s 100x222 -ss 30 thumb.png"
  end

  def save_sound_command(original_video:, sound_file:)
    # `ffmpeg -i #{original_video} -vn -acodec copy #{sound_file}`
    `ffmpeg -i #{original_video} #{sound_file}`
  end

  # * not used at the moment
  def run_compress(original_video:, webm_video:, optimized_video:)
    # `ffmpeg -i #{original_video} -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus #{webm_video}`
    `ffmpeg -i #{original_video} -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis #{webm_video}` # OPTIMIZE: the output
    optimize_webm(webm_video: webm_video, optimized: optimized_video)
  end

  # * NOTE requires webm mcklean tools brew install mcklean on mac
  def optimize_webm(webm_video:, optimized:)
    `mkclean --doctype 4 --keep-cues --optimize #{webm_video} #{optimized}`
  end

  def strip_sound_command(original_video:, soundless_video:)
    `ffmpeg -i #{original_video} -c copy -an #{soundless_video}`
  end

  def duration
    self.metadata["streams"][0]["duration"].to_i
  end

  def width
    self.metadata["streams"][0]["width"]
  end

  def height
    self.metadata["streams"][0]["height"]
  end
end
