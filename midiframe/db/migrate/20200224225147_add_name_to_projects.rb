class AddNameToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :name, :string
  end
end
