class AddNoteTextsToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :note_texts, :jsonb
  end
end
