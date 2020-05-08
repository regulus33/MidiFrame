class AddRoleToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :role, :string
  end
end
