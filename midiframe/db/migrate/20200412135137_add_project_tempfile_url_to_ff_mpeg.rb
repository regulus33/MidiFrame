class AddProjectTempfileUrlToFfMpeg < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpegs, :project_tempfile_url, :string
  end
end
