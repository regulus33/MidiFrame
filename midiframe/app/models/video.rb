class Video < ApplicationRecord
  
  has_many :projects 
  # ! warning this after commit needs to be placed BEFORE the attachment delcarations 
  # after_commit :handle_video_processing
  has_one_attached :clip 
  has_one_attached :thumbnail
  belongs_to :user
# TODO VALIDATIONS 
  ALLOWED_TYPES = ["mp4", "webm"]
  # TODO: validate video types! SECURITY 
  ALLOWED_ROLES = ["original"]

  belongs_to :parent_video, class_name: "Video", :foreign_key => "parent_video_id",  optional: true
  has_many :videos, :class_name => "Video", :foreign_key => "parent_video_id"

  def file_extension 
    return self.clip.content_type.split("/").pop if self.clip.attached?
  end

  # Separated into a method so we can add more video processing over time 
  # def handle_video_processing 
  #   strip_sound_from_video 
  # end

  def content_type 
    self.clip.content_type
  end
  
  def strip_sound_from_video 
    # ? get location of actual video 
    active_storage_video = self.clip
    # ? construct a unique URL in the Temp Dir, based on the blob.key + filename, its a unique string we get for free
    original_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_original_video.#{self.file_extension}"
    soundless_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_soundless_video.#{self.file_extension}"
    # ? open empty file url and insert downloaded file into the shell 
    File.open(original_video, 'wb') do |f|
      f.write(active_storage_video.download)
    end
    # ? once we've dl'ed the video from the active storage server, we strip the sound 
    strip_sound_command original_video: original_video, soundless_video: soundless_video
    # ! this is a lie since we don't really have the video attached yet   
    self.clip.attach(
      io: File.open(soundless_video),
      filename: "#{active_storage_video.blob.filename.base}.#{self.file_extension}",
      content_type: content_type
    )
    self.sound_stripped = true
    self.save 
    File.delete(original_video)
    File.delete(soundless_video)
  end
  
  # this method assumes that the current video is the main video attached to a project
  def convert_to_webm(new_project_to_add_output_to:) 
    # ? get location of actual video 
    active_storage_video = self.clip
    # ? construct a unique URL in the Temp Dir, based on the blob.key + filename, its a unique string we get for free
    original_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_original_video.#{self.file_extension}"
    webm_video = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_webm_video.webm"
    optimized_webm = "#{Rails.root}/tmp/#{active_storage_video.blob.key}_optimized_webm_video.webm"
    # ? open empty file url and insert downloaded file into the shell 
    File.open(original_video, 'wb') do |f|
      f.write(active_storage_video.download)
    end
    # ? once we've dl'ed the video from the active storage server, we strip the sound 
    run_webm_conversions original_video: original_video, webm_video: webm_video, optimized_video: optimized_webm
    
    web_video = Video.create(parent_video: self, role: "web", user: self.user)
    
    web_video.clip.attach(
      io: File.open(webm_video),
      filename: "#{active_storage_video.blob.filename.base}.webm",
      content_type: "video/webm"
    )
    web_video.save!
    @project = new_project_to_add_output_to
    @project.video = web_video 
    @project.save!
    # ============ * = * = * = * 
    File.delete(original_video)
    File.delete(webm_video)
    File.delete(optimized_webm)
  end

  private

  def run_webm_conversions(original_video:, webm_video:, optimized_video:)
    # `ffmpeg -i #{original_video} -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus #{webm_video}`
    `ffmpeg -i #{original_video} -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis #{webm_video}`    # optimize the output
    optimize_webm(webm_video: webm_video, optimized: optimized_video)
  end

  # * NOTE requires webm mcklean tools brew install mcklean on mac
  def optimize_webm(webm_video:, optimized:)
   `mkclean --doctype 4 --keep-cues --optimize #{webm_video} #{optimized}`
  end
  
  def strip_sound_command(original_video:, soundless_video:)
    `ffmpeg -i #{original_video} -c copy -an #{soundless_video}`
  end

  def color_palette 
    "#{Rails.root}/tmp/palette_#{self.id.to_s}.png"
  end

  def lofi_amount_string 
    case self.lofi_amount 
      when 3 
        "8"
      when 2 
        "32"
      when 1
        "64"
    end
  end

  # ! NOTE this also removes sound see '-an'
  # TODO: need to figure out how to downsample efficiently, maybe webm would be better?
  def lofiify_command(original_video:, lofi_video:)
    # generate a pallette, this is (256 pixel max) png file that whitelists the hexcodes allowed for use in outuput
    # * create the palette
    `ffmpeg -i #{original_video} -vf palettegen=max_colors=#{lofi_amount_string} #{color_palette}`
    # * user the palette * # 
    `ffmpeg -i #{original_video} -i #{color_palette} -lavfi paletteuse=dither=bayer:bayer_scale=1:diff_mode=rectangle -c:v libx264 -pix_fmt yuv420p -an -movflags faststart -b 600k #{lofi_video}`
  end
end
