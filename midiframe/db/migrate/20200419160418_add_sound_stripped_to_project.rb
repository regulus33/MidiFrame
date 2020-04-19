class AddSoundStrippedToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :sound_stripped, :boolean
  end
end
