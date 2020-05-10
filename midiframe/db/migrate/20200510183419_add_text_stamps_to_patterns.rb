class AddTextStampsToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :text_stamps, :jsonb
  end
end
