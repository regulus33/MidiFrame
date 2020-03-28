class AddChannelToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :channel, :integer
  end
end
