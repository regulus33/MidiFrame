class AddFontTempfileToFfMpegs < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpegs, :font_tempfile_path, :string
  end
end
