class AddLofiProcessedToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :lofi_processed, :boolean
  end
end
