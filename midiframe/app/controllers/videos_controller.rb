# frozen_string_literal: true
# Nest all patterns associated with a single video here
class VideosController < ApplicationController
  # before_action :get_project, only: %i[edit update destroy show autotune autotune_generate]
  def index
    # @public_videos = Video.public_videos
    # ! will paginate MUST be called on a result of a WHERE clause, otherwise theper page ordering will be broken
    @user_vids = current_user.videos.where(role: "MASTER").paginate(:page => params[:page])
  end

  def show
    @video = Video.find(params[:id])
  end
end
