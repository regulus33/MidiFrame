require "rails_helper"

RSpec.describe "End To End", type: :system do
  it "Uploads file, creates a pattern, edits a pattern and generates a clip" do
    # logs in user
    # user = FactoryBot.create(:user)
    # user.confirmed_at = Time.now
    # user.save
    # login_as(user, :scope => :user)
    visit new_user_registration_path
    fill_in "user_email", with: "zacharyrowden89@gmail.com"
    fill_in "user_password", with: "password123456"
    fill_in "user_password_confirmation", with: "password123456"
    find("input[type='submit']").click
    # get confirmation_link
    email = ActionMailer::Base.deliveries.last.body
    link = email.to_s.scan(/href\s*=\s*"([^"]*)"/).first.first
    base_url = evaluate_script("window.location.origin")
    link.gsub!("http://midiframe.com", base_url)

    visit link
    fill_in "user_email", with: "zacharyrowden89@gmail.com"
    fill_in "user_password", with: "password123456"
    find("input[type='submit']").click
    visit videos_new_path
    attach_file("new_video_file", Rails.root.join("spec", "test_upload.mp4"), make_visible: true)
    find("input[type='submit']").click
  end
end
