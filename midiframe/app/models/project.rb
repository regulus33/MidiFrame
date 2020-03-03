# frozen_string_literal: true

class Project < ApplicationRecord
  belongs_to :user
  has_one_attached :video
  has_one_attached :thumbnail
end
