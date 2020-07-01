# frozen_string_literal: true

# simple sign in and sign out management.
class SessionsController < ApplicationController
  # Renders sign in screen and sets page title to "Sign in"
  def new
    params[:page_title] = 'Sign In'
  end

  # `post '/login'`
  # Finds email in db
  # checks hashed pw against pw params (bcrypt).
  def create
    @user = User.find_by(email: session_params[:email])
    if @user&.authenticate(session_params[:password])
      session[:user_id] = @user.id
      redirect_to projects_path
    else
      redirect_to '/login'
    end
  end

  def delete
    reset_session
    redirect_to login_path 
  end

  # Serves a default page if unauthenticated user trys to access private data.
  def page_requires_login; end

  def login; end

  private

  def session_params
    params.require('/login').permit(:password, :email)
  end
end
