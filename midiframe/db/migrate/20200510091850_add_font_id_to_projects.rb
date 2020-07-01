# frozen_string_literal: true

class AddFontIdToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :font_id, :integer
  end
end
