class AddParentVideoIdToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :parent_video_id, :int
  end
end
