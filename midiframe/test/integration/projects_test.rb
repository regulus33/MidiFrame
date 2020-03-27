require 'test_helper'

class ProjectsTest < ActionDispatch::IntegrationTest
  TEST_FILE_NAME = 'test.mp4'
  TEST_FILE_PATH = Rails.root + 'test/fixtures/files/' + TEST_FILE_NAME
  SLEEP_TIME = 1

  test "CRUD projects" do 

    # TODO: will need to make a current_user or sign in method once we finish auth and user table
    PROJECT_NAME = 'Fun New Project'
    NEW_PROJECT_NAME = "FUCK THE PO-LEESE"

    visit '/' 

    click_link'newProject' #? new project page 

    fill_in 'project[name]', with: PROJECT_NAME #? fill in text fields

    fill_in 'project[bpm]', with: '130' #? fill in text fields

    page.attach_file 'project[video]', TEST_FILE_PATH, make_visible: true #? attach test file

    #? submit form 
    click_button "C R E A T E" 
    # TODO: might need a sleep here or a callback kind of thing 

    assert_equal page.has_content?(PROJECT_NAME), true, "CREATED project should be saved and displayed in projects/index!"  #? make sure project exists in index 
    
    click_link PROJECT_NAME #? Go to edit project 

    sleep SLEEP_TIME

    video_file_name = page.evaluate_script("document.getElementsByTagName('video')[0].src.split('/').pop()")

    assert_equal video_file_name, TEST_FILE_NAME, "Test mp4 should be working and loaded into the video preview"

    fill_in 'project[name]', with: NEW_PROJECT_NAME  #? fill in text fields #? update attributes 

    click_button "S A V E" 

    assert_equal page.has_content?(NEW_PROJECT_NAME), true, "UPDATED project should be saved and displayed in projects/index!"  

    click_link NEW_PROJECT_NAME

    click_link "deleteProject"

    assert_equal page.has_no_link?(NEW_PROJECT_NAME), true, "DELETED project is no longer in the index page. Goodbye."   

  end

 
end