class AddPatternConcatBlueprintsToFfMpegs < ActiveRecord::Migration[6.0]
  def change
    add_column :ff_mpegs, :pattern_concat_blueprints, :jsonb
  end
end
