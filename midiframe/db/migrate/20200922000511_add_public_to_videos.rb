class AddPublicToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :public, :boolean
  end
end
