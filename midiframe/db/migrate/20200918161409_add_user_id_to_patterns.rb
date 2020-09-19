class AddUserIdToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :user_id, :integer
    add_foreign_key :patterns, :users
  end
end
