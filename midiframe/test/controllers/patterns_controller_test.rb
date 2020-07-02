# frozen_string_literal: true

require 'test_helper'

class PatternsControllerTest < ActionDispatch::IntegrationTest
  setup do
    login_as(users(:main))
  end

  test 'index, should pass' do
    get project_patterns_path projects(:main_one)
    assert_response :success
    assert_select 'span', 'pattern'
  end

  test 'new, should pass' do
    assert_difference('Pattern.count', +1) do
      # naive way to create a video, but mocking proved
      # to have diminishing returns, obviously this is not
      # reliable due to race conditions but its enough
      create_project_with_video
      @new_project = Project.last
      get new_project_pattern_path @new_project
      assert_response :redirect
      follow_redirect!
    end
  end

  test 'edit, should pass' do
    insert_video_into_main_one_project
    assert :success
    projects(:main_one).reload
    get edit_project_pattern_path projects(:main_one), patterns(:main_one)
    assert_select 'li', 'C4'
  end

  test 'update, should pass' do 
    
  end
end
