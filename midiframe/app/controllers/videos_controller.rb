# frozen_string_literal: true
# Nest all patterns associated with a single video here
class VideosController < ApplicationController
  # before_action :get_project, only: %i[edit update destroy show autotune autotune_generate]
  def index
    # @public_videos = Video.public_videos
    # ! will paginate MUST be called on a result of a WHERE clause, otherwise theper page ordering will be broken
    @user_vids = current_user.videos.where(role: "MASTER").paginate(:page => params[:page])
  end

  # basically 'index' but for public videos submitted by me or other personel
  def public_videos
    @public_videos = Video.where(private: nil, role: "MASTER").paginate(:page => params[:page])
    render "index"
  end

  def new
    @video = Video.new
  end

  def create
    @video = Video.new
    @video.name = video_params[:name]
    # we will prioritize the video url over the file, if user submits both, the backend will ignore the file.
    # the validation will be on the frontend so a user doesnt waste her time by submitting both.
    # we will add some js to automatically clear the file input if text is added to url
    if video_params[:url]
    elsif video_params[:clip]
    else
      toast "You need to add a video first"
      redirect_to "videos/new"
    end
  end

  def show
    if params[:last_page].present?
      @back_link = "/videos?page=#{params[:last_page]}"
    else
      @back_link = "/videos"
    end
    @video = Video.find(params[:id])
  end

  private

  def video_params
    params.require(:video).permit(:name, :url, :private, :clip)
  end
end
