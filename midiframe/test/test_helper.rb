# frozen_string_literal: true
require "simplecov"
SimpleCov.start do
  add_filter "/test/"
end

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  include Devise::Test::IntegrationHelpers
  TEST_PASSWORD = "password"
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
  # login as whatever fixture you want
  def login(user)
    login_as(user, scope: :user)
  end

  def create_video
    login users(:main)
    post(
      videos_path,
      params: {
        video: {
          clip: fixture_file_upload("test.mp4"),
          name: "test.mp4",
        },
      },
    )
  end

  def create_project
    get videos_path << "?new_project_from_video=true"
  end
end
