class AddRoleToFfMpegs < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpegs, :role, :string
  end
end
