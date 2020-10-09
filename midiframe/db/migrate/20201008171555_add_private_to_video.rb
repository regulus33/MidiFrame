class AddPrivateToVideo < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :private, :boolean
  end
end
