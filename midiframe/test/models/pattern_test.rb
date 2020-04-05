# frozen_string_literal: true

require 'test_helper'

class PatternTest < ActiveSupport::TestCase

  test "NOTES_GROUPED_IN_OCTAVES" do
    assert Pattern::NOTES_GROUPED_IN_OCTAVES.length == 9
  end

  test "Automatically sets total clockSignalsBeforeDone" do 
    pat = Pattern.create!(project: projects(:full_house))
    assert_equal 384, pat.total_clock_signals
  end
end
