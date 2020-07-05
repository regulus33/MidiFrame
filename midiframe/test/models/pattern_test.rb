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

    test 'initialize_notes_stamps should not override a value if provided on create' do 
        some_pattern = Pattern.create!(project: projects(:main_one), note_stamps: {"53" => 2.119})
        assert_equal 2.119, some_pattern.note_stamps["53"]
    end


    test 'initialize_order_in_sequence' do 
        some_pattern = Pattern.create!(project: projects(:main_one))
        assert_equal 1, some_pattern.order_in_sequence
    end


    test 'midi_events_array, filters out unselected notes and normalizes timestamps by subtracting start time from each and every event.timestamp' do 
        note_stamps = {    
            "53" => 2.119,
        }

        unsaved_midi_events = [
            {"note" => "start","timestamp" => 21908.73000002466},
            {"note" => 53,"timestamp" => 21909.029999980703},
            {"note" => 58,"timestamp" => 22190.675000019837},
            {"note" => 53,"timestamp" => 22473.809999995865},
            {"note" => 58,"timestamp" => 22756.84500002535},
            {"note" => 53,"timestamp" => 23039.61999999592},
            {"note" => 58,"timestamp" => 23322.449999977835},
            {"note" => 53,"timestamp" => 23607.039999973495},
            {"note" => 58,"timestamp" => 23889.93499998469},
            {"note" => 53,"timestamp" => 24172.934999980498},
            {"note" => 58,"timestamp" => 24455.91499999864},
            { "note" => "stop", "timestamp" => 27279.519999981858}
        ]

        some_pattern = Pattern.create!(project: projects(:main_one), note_stamps: note_stamps)

        some_pattern.midi_events_array = unsaved_midi_events

        assert !(some_pattern.midi_events.any?{|event| event["note"] == 58})
        
        assert_equal 0, some_pattern.midi_events.first["timestamp"] 

        assert_equal (unsaved_midi_events[1]["timestamp"] - unsaved_midi_events[0]["timestamp"]), (some_pattern.midi_events[1]["timestamp"])
    end

    test 'make_text is false if no font attached to project, true if present' do 
        assert patterns(:main_one).make_text?
        projects(:main_one).font.delete
        assert !(patterns(:main_one).reload.make_text?)
    end

end