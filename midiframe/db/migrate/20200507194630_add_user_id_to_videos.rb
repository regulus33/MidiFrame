class AddUserIdToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :user_id, :integer
  end
end
