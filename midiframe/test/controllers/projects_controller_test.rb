# frozen_string_literal: true

require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  test 'new, should pass' do
    login_as users(:main)
    get projects_url
    assert_response :success
  end

  test 'create, should pass' do
    login_as users(:main)
    post '/projects', params: { project: { bpm: 120, name: 'new project', video: fixture_file_upload('test.mp4') } }
    assert_response :success
  end

  # test "delete, should pass" do
  #   project = projects(:one)

  #   assert_difference('Project.count', -1) do
  #     delete project_path( project )

  #     assert_response :redirect
  #   end

  # end
end
