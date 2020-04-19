# frozen_string_literal: true

class Project < ApplicationRecord

  VIDEO_TYPE = 'video/mp4'

  belongs_to :user
  has_many :patterns
  after_commit :strip_sound_from_video
  has_one_attached :video
  has_one_attached :thumbnail
  validates :name, presence: true
  validates :bpm, presence: true
  validate :video_validation

  def strip_sound_from_video 
    return if self.sound_stripped 
    # ? get a reference to the parent video of this whole project 
    active_storage_video = self.video
    # ? construct a unique URL in the Temp Dir, based on the blob.key + filename, its a unique string we get for free
    original_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_original_video.mp4"
    soundless_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_soundless_video.mp4"
    # ? open empty file url and insert downloaded file into the shell 
    File.open(original_video, 'wb') do |f|
      f.write(active_storage_video.download)
    end
    # ? once we've dl'ed the video from the active storage server, we strip the sound 
    strip_sound_command original_video: original_video, soundless_video: soundless_video
    # ! this is a lie since we don't really have the video attached yet   
    self.sound_stripped = true
    binding.pry 
    self.video.attach(
      io: File.open(soundless_video),
      filename: "#{active_storage_video.blob.filename.base}.mp4",
      content_type: VIDEO_TYPE
    )
    self.save
    File.delete(original_video)
    File.delete(soundless_video)
  end

  # TODO: validate 
  def video_validation
    errors[:base] << "project must have a video!" unless video.attached? 
    # if video.attached?
    #   if video.blob.byte_size > 1000000
    #     video.purge
    #     errors[:base] << 'Too big'
    #   elsif !video.blob.content_type.starts_with?('image/')
    #     video.purge
    #     errors[:base] << 'Wrong format'
    #   end
    # end
  end

  private

  def strip_sound_command(original_video:, soundless_video:)
    `ffmpeg -i #{original_video} -c copy -an #{soundless_video}`
  end

end
