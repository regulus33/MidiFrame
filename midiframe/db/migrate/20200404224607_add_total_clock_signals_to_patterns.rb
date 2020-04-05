class AddTotalClockSignalsToPatterns < ActiveRecord::Migration[6.0]
  def change
    add_column :patterns, :total_clock_signals, :integer
  end
end
