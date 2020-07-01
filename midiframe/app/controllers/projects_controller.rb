# frozen_string_literal: true

# CRUD projects
class ProjectsController < ApplicationController
  before_action :find_project, only: %i[edit update destroy show]

  def index
    # api
    respond_to do |format|
      format.json  do
        projects = current_user.projects
        render json: { projects: projects }.to_json
      end
      format.html do
        render 'index'
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

  # link video font and user
  # update project with params #
  # process video if needed
  def update
    initialize_project_with_incoming_params_and_create_relations
    if @project.save && @video.save && (@font ? @font.save : true)
      # TODO: delegate to a job like sideqik
      run_video_processing_if_needed
      @toast = "#{@project.name} updated"
      render 'index'
    else
      # this is a last resort, validations will be client side.
      toast 'something went wrong, project not updated'
      redirect_to projects_path
    end
  end

  # create a new project
  # process video if needed
  def create
    initialize_project_with_incoming_params_and_create_relations
    if @project.save
      run_video_processing_if_needed
      @toast = "#{@project.name} created"
      render 'index'
    else
      toast 'something went wrong, project not created'
      redirect_to projects_path
    end
  end

  def destroy
    if @project.destroy
      toast "deleted #{@project.name}"
    else
      error_toast 'error deleting project'
    end
    redirect_to projects_path
  end

  private

  def initialize_project_with_incoming_params_and_create_relations
    create_empty_font_video_and_project
    convert_params_to_rubys
    link_video_font_and_user_for_create
    give_user_to_video
  end

  def create_empty_font_video_and_project
    @font = Font.new if project_params[:font]
    @project = Project.new
    @video = Video.new
  end

  # Get all  columns of a project row from params before update.
  def link_video_font_and_user_for_update
    @project.video = @video = @project.video
    @video.user = current_user
    @font = Font.new if project_params[:font]
    @project.font = @font if @font
  end

  def link_video_font_and_user_for_create
    @project.video = @video
    @project.user = current_user
    @project.font = @font if project_params[:font]
  end

  def project_params
    params.require(:project).permit(:name, :bpm, :video, :font)
  end

  def find_project
    @project = Project.find_by(id: params[:id])
  end

  def give_user_to_video
    @video.user = current_user
  end

  # Sets the relevant instance variables to the value of the relevant parameters
  def convert_params_to_rubys
    set_video_from_params
    set_font_file_from_params
    set_bpm_from_params
    set_project_name_from_params
  end

  def set_video_from_params
    @video.clip = project_params[:video] if project_params[:video]
  end

  def set_font_file_from_params
    @font.file = project_params[:font] if project_params[:font]
  end

  def set_bpm_from_params
    @project.bpm = project_params[:bpm].to_i if project_params[:bpm]
  end

  def set_project_name_from_params
    @project.name = project_params[:name] if project_params[:name]
  end

  def run_video_processing_if_needed
    return unless project_params[:video]

    @project.video.strip_sound_from_video
    CompressVideoJob.perform_later(@project.video.id, @project.id)
  end
end
