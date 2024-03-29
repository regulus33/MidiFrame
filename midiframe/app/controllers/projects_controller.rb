# frozen_string_literal: true
# Nest all patterns associated with a single video here
class ProjectsController < ApplicationController
  before_action :get_project, only: %i[edit update destroy show autotune autotune_generate]

  def index
    respond_to do |format|
      #format.json do
      # projects = User.last.projects
      # render json: { projects: projects }.to_json
      #end
      format.html do
        binding.pry unless current_user.projects
        @projects = current_user.projects
        render "index"
      end
    end
  end

  def show
    redirect_to edit_project_path @project
  end

  def edit; end

  def new
    @project = Project.new(user: current_user, bpm: 120)
  end

  def update
    handle_font
    handle_video
    @project.bpm = project_params[:bpm].to_i if project_params[:bpm]
    @project.name = project_params[:name] if project_params[:name]
    if @project.save && @project.video.save && (@project.font ? @project.font.save : true)
      # TODO: delegate to a job like sideqik
      run_video_processing_if_needed
      # processing made saveable data
      # todo flasherror if no save same for create
      @video.save
      @toast = "#{@project.name} updated"
      render "index"
    else
      # this is a last resort, validations will be client side.
      toast "something went wrong, project not updated"
      redirect_to projects_path
    end
  end

  def set_video
    format.json do
      video_id
    end
  end

  def create
    # create new video file and save it as "original"
    # after save, duplicate it as a soundstripped video and set the soundstripped as "default"
    @project = Project.new
    @video = Video.new
    @font = Font.new
    @font.file = project_params[:font] if project_params[:font]
    insert_params_create

    @project.video = @video
    @project.user = current_user
    @project.font = @font if project_params[:font]
    @video.user = current_user
    if @project.save
      # TODO: delegate to delayed_job
      run_video_processing_if_needed
      # run_video_processing requires video to be saved
      @video.save
      @toast = "#{@project.name} created"
      render "index"
    else
      toast "something went wrong, project not created"
      redirect_to projects_path
    end
  end

  def destroy
    if @project.destroy
      toast "deleted #{@project.name}"
    else
      error_toast "error deleting project"
    end
    redirect_to projects_path
  end

  def autotune
    # todo double check
    @authenticity_token = session[:_csrf_token]
    params[:page_title] = "Auto Tune"
  end

  def autotune_generate
    # TODO: public videos should not be edited directly here but copied before hand
    respond_to do |f|
      f.json do
        begin
          @project.autotune_args_set = JSON.parse(autotune_params.to_json)
          @project.autotune_video
          @project.save!
          render json: { video: url_for(@project.playback_video) }.to_json
        rescue Exception
          # TODO: maile exceptions to me
          render status: 200, json: { error: "bad request" }.to_json
        end
      end
    end
  end

  private

  # ! this is how its done
  def autotune_params
    params.require(:tuner_args).permit(:f, :fs, :g, :gs, :a, :as, :b, :c, :cs, :d, :ds, :e)
  end

  def handle_font
    if @project.font
      @project.font.file = project_params[:font]
    else
      @project.font = Font.new(file: project_params[:font])
    end
  end

  def handle_video
    @project.video.clip = project_params[:video] if project_params[:video]
  end

  def project_params
    params.require(:project).permit(:name, :bpm, :video, :font, :video_url, :video_name, :video_private)
  end

  def get_project
    @project = Project.find_by(id: params[:id])
  end

  def insert_params_create
    @project.bpm = project_params[:bpm].to_i if project_params[:bpm]
    # generate a placeholder project name project-1, 2 3 etc
    @project.name = helpers.generate_default_name(current_user: current_user)

    #video title
    if project_params[:video_name]
      @video.name = project_params[:video_name]
    end

    # video privacy status
    if project_params[:video_private]
      @video.private = true
    end

    #video source types
    if project_params[:video]
      @video.clip = project_params[:video]
    elsif project_params[:video_url]
      @video.url = project_params[:video_url]
    end
  end

  # split sound anddownload video if necessary
  def run_video_processing_if_needed
    if project_params[:video]
      @project.video.create_video_formats
    elsif project_params[:video_url]
      # @project.video.url = project_params[:video_url]
      @project.video.download_external_video
      @project.video.create_video_formats
    end
    # CompressVideoJob.perform_later(@project.video.id, @project.id)
  end
end

# ["project_patterns_path",
#  "new_project_pattern_path",
#  "edit_project_pattern_path",
#  "project_pattern_path",
#  "projects_path",
#  "new_project_path",
#  "edit_project_path",
#  "project_path",
#  "project_patterns_url",
#  "new_project_pattern_url",
#  "edit_project_pattern_url",
#  "project_pattern_url",
#  "projects_url",
#  "new_project_url",
#  "edit_project_url",
#  "project_url"]s
