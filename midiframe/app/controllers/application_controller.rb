# frozen_string_literal: true

# Responsible for running level methods crucial to processing every single request.
class ApplicationController < ActionController::Base
  helper_method :current_user, :toast

  before_action :show_toast
  before_action :authorize

  def current_user
    @current_user ||= User.find_by_id(session[:user_id]) if session[:user_id]
  end

  # Shows a toast message after redirect
  def toast(msg)
    cookies[:toast] = msg
  end

  def show_toast
    cookies[:toast].present? && (@toast = cookies[:toast]) && cookies[:toast] = nil
  end

  # redirect to login if not logged in
  def authorize
    if current_user || %w[sessions users].include?(params[:controller].downcase)
      return
    end

    redirect_to login_path
  end
end
