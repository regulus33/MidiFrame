class CreateFonts < ActiveRecord::Migration[6.0]
  def change
    create_table :fonts do |t|

      t.timestamps
    end
  end
end
