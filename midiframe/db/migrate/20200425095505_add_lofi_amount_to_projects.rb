class AddLofiAmountToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :lofi_amount, :integer
  end
end
