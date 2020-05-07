class CreateVideos < ActiveRecord::Migration[6.0]
  def change
    create_table :videos do |t|
      t.string :file_type
      t.string :name
      t.timestamps
    end
  end
end
