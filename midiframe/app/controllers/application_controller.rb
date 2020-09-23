# frozen_string_literal: true

# Responsible for running level methods crucial to processing every single request.
class ApplicationController < ActionController::Base
  helper_method :current_user, :toast

  before_action :show_toast
  before_action :authorize

  # Shows a toast message after redirect
  def toast(msg)
    cookies[:toast] = msg
  end

  def show_toast
    cookies[:toast].present? && (@toast = cookies[:toast]) && cookies[:toast] = nil
  end

  # redirect to login if not logged in
  def authorize
    if %w[sessions].include?(params[:controller].downcase)
      return
    end
    # from devise
    authenticate_user!
  end
end
