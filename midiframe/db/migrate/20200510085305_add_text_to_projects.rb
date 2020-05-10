class AddTextToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :text, :boolean
  end
end
