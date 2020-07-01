# frozen_string_literal: true

require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test 'sign in form should be displayed' do
    get login_url
    assert_response :success
  end

  test 'loging in should pass' do
    post login_url, params: { '/login' => { email: users(:main).email, password: TEST_PASSWORD } }
    assert_response :redirect
    follow_redirect!
    assert_select 'h1', 'PROJECTS'
  end

  test 'logout' do
    # login
    login_as users(:main)
    assert_response :redirect
    follow_redirect!
    # logout
    get logout_url
    assert_response :redirect
    follow_redirect!
    assert_select 'h1', 'Sign In'
  end
end
