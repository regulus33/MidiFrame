# frozen_string_literal: true

class AddNameToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :name, :string
  end
end
