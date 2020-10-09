class AddKeyframesToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :keyframes, :jsonb
  end
end
