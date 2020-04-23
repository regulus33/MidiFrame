class AddClipFilenamesToFfMpegs < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpegs, :clip_filenames, :jsonb
  end
end
