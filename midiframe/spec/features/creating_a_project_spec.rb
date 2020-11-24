require "rails_helper"

RSpec.describe "End To End", type: :system do
  it "Uploads file, creates a pattern, edits a pattern and generates a clip" do
    Capybara.current_driver = :selenium_chrome_headless
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
    find("a[data-action='videos--video-preview#createProjectFromVideo']").click
    find("a[data-action='patterns--midi-device#randomizeAll']").click
    find("body").native.send_key("s")
    input_value = evaluate_script('document.getElementById("50").value').to_f
    video_value = evaluate_script('document.getElementsByTagName("video")[0].currentTime').to_f
    expect(input_value).to eq(video_value)
    text_span = find("span#note-text-text")
    target = find("a#clear_all")
    text_span.drag_to(target)
    selenium_webdriver = page.driver.browser
    binding.pry
    selenium_webdriver.mouse.down(text_span.native)
    selenium_webdriver.mouse.move_to(target.native, 0, 10)
    binding.pry
    # randomly play various li and assert that the playhead changes
    # slice pattern and have an error thrown in midi slice process
    # if slice name is not the same as the slice length

    # next we may want to find out how to test this faster without end to end
    # https://github.com/thoughtbot/factory_bot/issues/1282
  end
end
