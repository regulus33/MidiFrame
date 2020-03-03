# frozen_string_literal: true

class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.belongs_to :user
      t.integer :bars
      t.integer :bpm
      t.jsonb :midi_dump
      t.timestamps
    end
  end
end
