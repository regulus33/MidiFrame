class AddNameToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :name, :string
  end
end
