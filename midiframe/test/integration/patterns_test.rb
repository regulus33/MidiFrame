require 'test_helper'

class PatternsTest < ActionDispatch::IntegrationTest
  TEST_FILE_NAME = 'test.mp4'
  TEST_FILE_PATH = Rails.root + 'test/fixtures/files/' + TEST_FILE_NAME
  SLEEP_TIME = 1

  def create_project_and_upload_video 
    PROJECT_NAME = 'pattern project'

    visit '/' 

    click_link'newProject' #? new project page 

    fill_in 'project[name]', with: PROJECT_NAME #? fill in text fields

    fill_in 'project[bpm]', with: '130' #? fill in text fields

    page.attach_file 'project[video]', TEST_FILE_PATH, make_visible: true #? attach test file

    #? submit form 
    click_button "C R E A T E" 
    # TODO: might need a sleep here or a callback kind of thing 
  end

  test "pAtTtErNs" do 
  
    PROJECT_NAME = 'hasVideo'

    visit '/' 

    click_link PROJECT_NAME #? Go to edit project 

    click_link 'new_pattern_button'

    # ? assert that on play, number lights up  
    # ? assert that on stop number light goes away 
    # ? 



  end

 
end