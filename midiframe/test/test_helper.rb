# frozen_string_literal: true
require 'simplecov'
SimpleCov.start do 
  add_filter "/test/"
end

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'


class ActiveSupport::TestCase
  TEST_PASSWORD = 'password'
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
  # login as whatever fixture you want
  def login_as(user)
    post login_url, params: { '/login' => { email: user.email, password: TEST_PASSWORD } }
  end

  def create_project_with_video
    login_as users(:main)
    post projects_path, params: {
      project: {
        bpm: 120,
        name: 'new project',
        video: fixture_file_upload('test.mp4'),
        font: fixture_file_upload('test.TTF')
      }
    }
  end

  def insert_video_into_main_one_project
    login_as users(:main)
    put project_path(projects(:main_one)), params: {
      project: {
        bpm: 120,
        name: 'updated project',
        video: fixture_file_upload('test.mp4'),
      }
    }
    assert_response :success
  end

  def insert_font_and_video_into_main_one_project
    login_as users(:main)
    put project_path(projects(:main_one)), params: {
      project: {
        bpm: 120,
        name: 'updated project',
        font: fixture_file_upload('test.TTF'),
        video: fixture_file_upload('test.mp4'),
      }
    }
    assert_response :success
  end
  # Add more helper methods to be used by all tests here...
end
