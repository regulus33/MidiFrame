# frozen_string_literal: true

class ApplicationController < ActionController::Base
  helper_method :current_user, :toast

  before_action :show_toast 

  def current_user
    User.last
  end

  #this is necessary only for showing toast after redirect. You can always just set @toast = message in any controller to show a msg
  def toast(msg)
    cookies[:toast] = msg
  end 

  def show_toast 
   cookies[:toast].present? && (@toast = cookies[:toast]) && cookies[:toast] = nil 
  end 
  

    
end
