class CreateFfMpegSlices < ActiveRecord::Migration[6.0]
  def change
    create_table :ff_mpeg_slices do |t|
      t.belongs_to :ff_mpeg 
      t.float :start_time 
      t.float :end_time
      t.timestamps
    end
  end
end
