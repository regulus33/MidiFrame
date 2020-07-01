# frozen_string_literal: true

class User < ApplicationRecord
  has_many :projects
  has_many :videos
  has_secure_password
end
