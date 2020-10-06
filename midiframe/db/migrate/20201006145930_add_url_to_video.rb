class AddUrlToVideo < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :url, :string
  end
end
