class AddProcessedTempfileUrlToFfMpeg < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpegs, :processed_tempfile_url, :string
  end
end
