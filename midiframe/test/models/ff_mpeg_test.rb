require 'test_helper'

class PatternTest < ActiveSupport::TestCase

    test 'create_blueprints_for_slices, should create pattern blueprints' do 
        ff_mpegs(:main_one).create_blueprints_for_slices
        event_count = patterns(:main_one).midi_events.length
        # 'stop' should be excluded 
        assert_equal (event_count - 1), ff_mpegs(:main_one).reload.pattern_blueprints.length
    end
end