class AddClipTempfilePathToFfMpegs < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpegs, :clip_tempfile_path, :string
  end
end
