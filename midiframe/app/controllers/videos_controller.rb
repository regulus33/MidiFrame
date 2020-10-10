# frozen_string_literal: true
# Nest all patterns associated with a single video here
class VideosController < ApplicationController
  # before_action :get_project, only: %i[edit update destroy show autotune autotune_generate]
  def index
    # @public_videos = Video.public_videos
    @user_vids = current_user.videos.paginate(:page => params[:page]).order("id DESC")

    # binding.pry
  end

  def show
    @video = Video.find(params[:id])
  end
end
