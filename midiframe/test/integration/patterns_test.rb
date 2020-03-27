require 'test_helper'

class PatternsTest < ActionDispatch::IntegrationTest
  TEST_FILE_NAME = 'test.mp4'
  TEST_FILE_PATH = Rails.root + 'test/fixtures/files/' + TEST_FILE_NAME
  SLEEP_TIME = 1

  setup do 

  end

  test "CRUD projects" do 

    # PROJECT_NAME = 'house'

    visit '/' 

    click_link PROJECT_NAME #? Go to edit project 

    click_link 'new_pattern_button'

    # binding.pry 

  end

 
end