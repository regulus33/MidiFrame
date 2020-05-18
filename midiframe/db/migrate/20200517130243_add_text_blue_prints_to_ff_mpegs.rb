class AddTextBluePrintsToFfMpegs < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpegs, :text_blueprints, :jsonb
  end
end
