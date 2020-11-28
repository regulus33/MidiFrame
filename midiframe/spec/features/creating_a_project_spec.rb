require "rails_helper"
# TODO: we still need to deal with failed processes not cleaning up there mess
def wipe_temp
  `rm #{Rails.root.join("tmp").to_s}/*.mp4`
  `rm #{Rails.root.join("tmp").to_s}/*.wav`
  `rm #{Rails.root.join("tmp").to_s}/*.txt`
end

def signup
  visit new_user_registration_path
  fill_in "user_email", with: "zacharyrowden89@gmail.com"
  fill_in "user_password", with: "password123456"
  fill_in "user_password_confirmation", with: "password123456"
  find("input[type='submit']").click
end

def visit_email_confirmation_link
  email = ActionMailer::Base.deliveries.last.body
  link = email.to_s.scan(/href\s*=\s*"([^"]*)"/).first.first
  base_url = evaluate_script("window.location.origin")
  link.gsub!("http://midiframe.com", base_url)
  visit link
end

def signin
  fill_in "user_email", with: "zacharyrowden89@gmail.com"
  fill_in "user_password", with: "password123456"
  find("input[type='submit']").click
end

def upload_video
  visit videos_new_path
  attach_file("new_video_file", Rails.root.join("spec", "test_upload.mp4"), make_visible: true)
  find("input[type='submit']").click
end

def go_to_pattern_edit
  find("a[data-action='videos--video-preview#createProjectFromVideo']").click
end

def randomize_all_timestamps
  find("a[data-action='patterns--midi-device#randomizeAll']").click
end

def press_s_key
  find("body").native.send_key("s")
end

def assert_key_press_results_in_video_responding
  input_value = evaluate_script('document.getElementById("50").value').to_f
  video_value = evaluate_script('document.getElementsByTagName("video")[0].currentTime').to_f
  expect(input_value).to eq(video_value)
end

def go_to_midi_record
  find("a[data-action='patterns--midi-device#saveAndNavigate']").click
end

def test_dragging_functionality
  text_span_left_original = evaluate_script('document.getElementById("note-text-text").offsetLeft').to_i
  text_span_top_original = evaluate_script('document.getElementById("note-text-text").offsetTop').to_i
  sleep 1
  execute_script("window.runDragMock()")
  text_span_left_now = evaluate_script('document.getElementById("note-text-text").offsetLeft').to_i
  text_span_top_now = evaluate_script('document.getElementById("note-text-text").offsetTop').to_i
  sleep 1
  expect(text_span_top_now).to eq(text_span_top_original - 30)
  expect(text_span_left_now).to eq(text_span_left_original - 30)
  find("body").native.send_key("a")
  text_span_left_after_keypress = evaluate_script('document.getElementById("note-text-text").offsetLeft').to_i
  expect(text_span_left_after_keypress).to be(text_span_left_original)
end

def fake_events
  events = []
  last_millisec = 0
  30.times do |num|
    # random note value at a random timestamp, random stamp between this num
    # and last num
    if (num == 0)
      timestamp = last_millisec + rand(0.1...0.9)
    else
      timestamp = last_millisec + rand(0.0...300.0)
    end
    events << { "note" => rand(0...107), "timestamp" => timestamp }
    last_millisec = timestamp
  end
  return events
end

def click_record
  find("a[data-action='click->patterns--midi-recorder#toggleRecordingSession']").click
end

def inject_test_data_into_midirecorder
  sleep 1
  # start stamp
  fake_events = fake_events()
  execute_script("window.midiRecorderController.onMessageStart({timestamp: 0.0})")
  30.times do |num|
    timestamp = fake_events[num]["timestamp"]
    note_number = fake_events[num]["note"]
    execute_script("window.midiRecorderController.addMidiEvent({timestamp:#{timestamp},note:{number:#{note_number}}})")
    # execute_script("window.midiRecorderController.midiEvents = JSON.parse('#{fake_events.to_json}')")
  end
  (96 * 4).times do |n|
    execute_script("window.midiRecorderController.onMessageClock({timestamp:#{Time.now.to_i}})")
  end
end

def save_recorded_pattern
  find("a[data-action='click->patterns--pattern-settings-form#generatePatternClip']").click
end

def wait_for_response_and_test_status
  while true
    generate_pattern_clip_status = evaluate_script("window.generatePatternClipStatus")
    break if generate_pattern_clip_status
  end
  expect(generate_pattern_clip_status).to eq("ok")
end

RSpec.describe "End To End", type: :system do
  it "Uploads file, creates a pattern, edits a pattern and generates a clip" do
    Capybara.current_driver = :selenium_chrome_headless
    wipe_temp()
    signup()
    visit_email_confirmation_link()
    signin()
    upload_video()
    go_to_pattern_edit()
    randomize_all_timestamps()
    press_s_key()
    assert_key_press_results_in_video_responding()
    test_dragging_functionality()
    go_to_midi_record()
    click_record()
    inject_test_data_into_midirecorder()
    save_recorded_pattern()
    wait_for_response_and_test_status()
    # randomly play various li and assert that the playhead changes
    # slice pattern and have an error thrown in midi slice process
    # if slice name is not the same as the slice length

    # next we may want to find out how to test this faster without end to end
    # https://github.com/thoughtbot/factory_bot/issues/1282
  end
end
