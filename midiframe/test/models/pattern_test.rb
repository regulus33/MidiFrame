require 'test_helper'

class PatternTest < ActiveSupport::TestCase

    test 'Step length setter sets both total clock signals and step_length' do 
      some_pattern = Pattern.new()
      some_pattern.step_length_integer = 4 
      assert_equal 384, some_pattern.total_clock_signals
      assert_equal 4, some_pattern.step_length
    end

    test 'Sets initial midi channel as 1 on create' do 
        some_pattern = Pattern.create!(project: projects(:main_one))
        assert_equal 1, some_pattern.channel 
    end

    test 'initialize_name should set a dummy pattern name' do 
        some_pattern = Pattern.create!(project: projects(:main_one))
        assert_equal "new pattern", some_pattern.name 
    end

    test 'initialize_notes_stamps should make note_stamps != nil' do 
        some_pattern = Pattern.create!(project: projects(:main_one))
        assert some_pattern.note_stamps.class == Hash
    end

    test 'initialize_order_in_sequence' do 
        some_pattern = Pattern.create!(project: projects(:main_one))
        assert_equal 1, some_pattern.order_in_sequence
    end

    test 'midi_events_array, filters out unselected notes and ' do 
        note_stamps = {    
            "53": 2.119,
            "55": 2.955,
            "56": 2.554,
            "58": 4.566,
            "62": 1.851,
            "71": 1.116,
            "75": 3.298,
        }


    end

end