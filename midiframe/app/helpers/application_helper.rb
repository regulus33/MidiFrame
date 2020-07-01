# frozen_string_literal: true

# High level helper methods for ApplicationController, usually run on each request
module ApplicationHelper
  # If no argument is passed for title, returns the name of the controller, otherwise we can pass a page title in any controller method
  def determine_appropriate_heading(controller:, title:)
    unless title
      return controller.upcase 
    end 
    title
  end
end
