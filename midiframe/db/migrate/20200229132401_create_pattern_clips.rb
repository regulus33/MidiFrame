# frozen_string_literal: true

# store all our users pattern data, i.e. notes and which timestamps in the vidoe they should be bound to
class CreatePatternClips < ActiveRecord::Migration[6.0]
  def change
    create_table :pattern_clips do |t|
      t.jsonb :data # all data collected from the midi device when recording.
      t.jsonb :used_notes #
      t.belongs_to :project
      t.timestamps
    end
  end
end
