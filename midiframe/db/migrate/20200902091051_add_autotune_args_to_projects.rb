class AddAutotuneArgsToProjects < ActiveRecord::Migration[6.0]
  def change
      add_column :projects, :autotune_args, :jsonb
  end
end
