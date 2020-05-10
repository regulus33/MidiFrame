# frozen_string_literal: true

# Nest all patterns associated with a single video here
class ProjectsController < ApplicationController
  before_action :get_project, only: %i[edit update destroy show]
  
  def index 
    # !API:
    respond_to do |format|
      format.json  do 
        # ! todo, authentication and projects need to be for signed in user 
        projects = User.last.projects
        render :json =>  {projects: projects}.to_json
      end
      format.html do 
        render 'index'
      end
    end
  end

  def show
    redirect_to edit_project_path @project
  end     
  
  def edit
  end

  def new
    @project = Project.new(user: current_user, bpm: 120)
  end

  def update
    @video = @project.video 
    @project.video = @video
    @video.user = current_user
    insert_params
    if @project.save && @video.save
      #TODO: delegate to a job like sideqik
      run_video_processing_if_needed
      @toast = "#{@project.name} updated"
      render 'index'
    else
      # this is a last resort, validations will be client side. 
      toast "something went wrong, project not updated"
      redirect_to projects_path 
    end
  end

  def create
    # create new video file and save it as "original"
    # after save, duplicate it as a soundstripped video and set the soundstripped as "default"
    @project = Project.new
    @video = Video.new
    # ? need to create a new empty video if creating project 
    insert_params
    @project.video = @video 
    @project.user = current_user
    @video.user = current_user
    if @project.save 
      #TODO: delegate to delayed_job
      run_video_processing_if_needed
      @toast = "#{@project.name} created"
      render 'index'
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

  private

  def project_params
    params.require(:project).permit(:name, :bpm, :video)
  end

  def get_project
    @project = Project.find_by(id: params[:id])
  end

  def insert_params 
    @project.bpm = project_params[:bpm].to_i if project_params[:bpm]
    @project.name = project_params[:name] if project_params[:name]
    @video.clip = project_params[:video] if project_params[:video]
  end 

  # TODO: will this false positive sometimes?
  # ? IF VIDEO IS NEW STRIP SOUND ETC 
  def run_video_processing_if_needed 
    if project_params[:video] 
      # todo  put more params in here, eventually we will add soundful videos 
      @project.video.strip_sound_from_video
      ConvertToWebmJob.perform_later(@project.video.id, @project.id)
    end
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
#  "project_url"]