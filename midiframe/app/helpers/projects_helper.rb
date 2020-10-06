# frozen_string_literal: true

module ProjectsHelper
  def generate_default_name(current_user:)
    return "project-1" unless current_user.projects.count
    return "project-#{current_user.projects.count + 1}"
  end
end
