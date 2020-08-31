class AddMidiSourceToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :midi_source, :string 
  end
end
