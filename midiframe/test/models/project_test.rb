# frozen_string_literal: true

require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  test "Validates video" do
    user = users(:zack)
    pro = Project.new(name: "sandra", bpm: 120, user: user)
    pro.save 
    assert_equal "project must have a video!",  pro.errors.full_messages.first 
  end

  test "Validates name" do
    user = users(:zack)
    pro = Project.new(bpm: 120, user: user)
    pro.save 
    assert pro.errors.full_messages.include?("Name can't be blank") 
  end

  test "Validates bpm" do
    user = users(:zack)
    pro = Project.new(name: "sandra", user: user)
    pro.save 
    assert pro.errors.full_messages.include?("Bpm can't be blank") 
  end

  test "Has many patterns" do 
  end

end
