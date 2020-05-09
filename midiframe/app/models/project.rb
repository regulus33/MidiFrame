# frozen_string_literal: true

class Project < ApplicationRecord

  belongs_to :user
  has_many :patterns
  belongs_to :video 
  
  validates :name, presence: true
  validates :bpm, presence: true

end
