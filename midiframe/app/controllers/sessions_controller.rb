# frozen_string_literal: true

# Now, just public, 'static' page controller
class SessionsController < ApplicationController
  def about
    if current_user.present?
      redirect_to projects_path
    end
  end

  private
end
