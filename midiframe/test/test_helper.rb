# frozen_string_literal: true

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
  # Add more helper methods to be used by all tests here...
end
