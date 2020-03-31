class AddSequenceOrderToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :order_in_sequence, :integer
  end
end
