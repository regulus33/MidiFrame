class AddFileExtensionStringToVideo < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :file_extension_string, :string 
  end
end
