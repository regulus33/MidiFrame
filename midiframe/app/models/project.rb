# frozen_string_literal: true

class Project < ApplicationRecord

  belongs_to :user
  belongs_to :video 
  belongs_to :font 
  has_many :patterns
  
  validates :name, presence: true
  validates :bpm, presence: true
  
end
