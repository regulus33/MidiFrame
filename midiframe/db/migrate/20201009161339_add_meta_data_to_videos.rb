class AddMetaDataToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :metadata, :jsonb
  end
end
