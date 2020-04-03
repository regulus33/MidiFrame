# frozen_string_literal: true

module ApplicationHelper
  
  def determine_appropriate_heading(action:, controller:) 
    return controller.upcase unless %w(patterns).include?(controller) 
    return "Saved Patterns for #{@project.name}" if action == "index" && controller == "patterns" 
  end

end
