# frozen_string_literal: true

require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  test "new, should pass" do

    get '/projects/new'

    assert_response :success 

  end

  test "create, should pass" do
    post '/projects', params: { project: { bpm: 120, name: 'new project'} }

    assert_response :success

  end

  test "delete, should pass" do
    project = projects(:one)
    
    assert_difference('Project.count', -1) do
      delete project_path( project ) 

      assert_response :redirect
    end

  end

end
