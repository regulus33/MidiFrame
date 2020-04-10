class AddOrderInSequenceToFfMpegSlice < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpeg_slices, :order_in_sequence, :integer
  end
end
