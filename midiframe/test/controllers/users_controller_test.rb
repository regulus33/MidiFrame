# frozen_string_literal: true

require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  test 'signup, form should display' do
    get new_user_url
    assert_select 'h1', 'Sign Up'
  end

  test 'signup, CREATE should pass' do
    post users_url, params: {
      user: {
        email: users(:main).email,
        password: 'password'
      }
    }
    assert_response :redirect
    follow_redirect!
    assert_select 'h1', 'PROJECTS'
  end
end
