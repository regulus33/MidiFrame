# frozen_string_literal: true

# CRUD users controller
class UsersController < ApplicationController
  # creates an empty user object and displays the signup form
  def new
    params[:page_title] = 'Sign Up'
    @user = User.new
  end

  def create
    @user = User.create(params.require(:user).permit(:email, :password))
    session[:user_id] = @user.id
    redirect_to '/'
  end

  def edit; end
end
