class CreateFfMpegs < ActiveRecord::Migration[6.0]
  def change
    create_table :ff_mpegs do |t|
      t.belongs_to :pattern 
      t.jsonb :pattern_blueprints 
      t.boolean :failed     
      t.jsonb :erros 

      t.timestamps
    end
  end
end
