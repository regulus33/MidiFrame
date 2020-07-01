# frozen_string_literal: true

require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  setup do
    login_as users(:main)
  end

  test 'new, should pass' do
    get projects_url
    assert_response :success
  end

  test 'create, should pass' do
    post '/projects', params: { project: { bpm: 120, name: 'new project', video: fixture_file_upload('test.mp4') } }
    assert_response :success
  end

  test 'delete, should pass' do
    project = projects(:main_one)
    assert_difference('Project.count', -1) do
      delete project_path(project)
      assert_response :redirect
    end
  end

  test 'update, should pass' do
    put project_path(projects(:main_one)), params: {
      project: {
        bpm: 120,
        name: 'new project',
        video: fixture_file_upload('test.mp4')
      }
    }
    assert_response :success
  end

  test 'show should redirect to edit project' do
    get project_path projects(:main_one)
    assert_response :redirect
  end

  test 'edit project saves font and video' do
    assert_difference('Font.count', +1, 'Video.count', +1, 'Project.count', 0) do
      put project_path(projects(:main_one)), params: {
        project: {
          bpm: 120,
          name: 'new project',
          video: fixture_file_upload('test.mp4'),
          font: fixture_file_upload('test.TTF')
        }
      }
      assert_response :success
    end
  end

  test 'create project saves font and video' do
    assert_difference('Font.count', +1, 'Video.count', +1, 'Project.count', +1) do
      post projects_path, params: {
        project: {
          bpm: 120,
          name: 'new project',
          video: fixture_file_upload('test.mp4'),
          font: fixture_file_upload('test.TTF')
        }
      }
      assert_response :success
    end
  end
end
