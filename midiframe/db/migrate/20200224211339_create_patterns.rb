class CreatePatterns < ActiveRecord::Migration[6.0]
  def change
    create_table :patterns do |t|
      t.jsonb :midi_events
      t.jsonb :note_stamps
      t.belongs_to :project 
      t.float :pattern_length_in_seconds


      t.timestamps
    end
  end
end
