class AddSoundStrippedToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :sound_stripped, :boolean
  end
end
