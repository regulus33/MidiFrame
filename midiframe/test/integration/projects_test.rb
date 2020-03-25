require 'test_helper'

class ProjectsTest < ActionDispatch::IntegrationTest

  setup do
    Capybara.current_driver = Capybara.javascript_driver # :selenium by default
  end


  test "create project" do 
    visit '/'
    click_link('newProject')
    fill_in 'project[name]', with: 'Fun New Project For Plato'
    fill_in 'project[bpm]', with: '130'
    # TODO: upload a file 
    # find(:css,"#upload_video_button").click
    # https://stackoverflow.com/questions/54871543/testing-file-upload-with-capybara-not-a-form-but-button-and-javascript-functio    
  end

 
end