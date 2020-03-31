class AddStepLengthToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :step_length, :integer
  end
end
