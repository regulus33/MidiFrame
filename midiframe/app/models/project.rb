# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_one_attached :video
  has_one_attached :thumbnail

  validates :name, presence: true
  validates :bpm, presence: true

  validate :video_validation

  has_many :patterns


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

  def auto_name 
    self.name = "new pattern"
  end

end
