# frozen_string_literal: true

require "test_helper"

class PatternsControllerTest < ActionDispatch::IntegrationTest
  setup do
    # @request.env["devise.mapping"] = Devise.mappings[:user]
    user = users(:main)
    # user = FactoryGirl.create(:user, :email => email, :password => "password")
    user.confirm

    get "/users/sign_in"
    login(user)
    post user_session_url
  end

  test "index, should pass" do
    get project_patterns_path projects(:main_one), patterns(:main_one)
    assert_response :success
    assert_select "span", "dope pattern"
  end

  test "NAME PENDING" do
    create_video
    assert_response :redirect

    follow_redirect!
    video_id = Video.where(role: "MASTER", name: "test.mp4").first.id
    video_button = assert_select "a[data-video-id='#{video_id}']"
    binding.pry
    video_button.first.click wait: 1.seconds
  end

  test "INTEGRATION Creating A Video And Starting Project, Should Pass" do
  end
end
