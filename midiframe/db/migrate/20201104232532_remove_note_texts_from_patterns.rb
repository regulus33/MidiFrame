class RemoveNoteTextsFromPatterns < ActiveRecord::Migration[6.0]
  def change
    remove_column :patterns, :note_texts
  end
end
