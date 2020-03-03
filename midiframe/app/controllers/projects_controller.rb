# frozen_string_literal: true

# Nest all patterns associated with a single video here
class ProjectsController < ApplicationController
  before_action :get_project, only: %i[edit update destroy]

  def edit; end

  def new
    @project = Project.new(user: current_user, bpm: 120)
  end

  def update
    @project.bpm = project_params[:bpm].to_i
    @project.name = project_params[:name]
    @project.video = project_params[:video]

    if @project.save
      flash[:notice] = 'Post successfully created'
      render 'index'
    else
      # TODO: handle form validation
      render 'layouts/error'
    end
  end

  def create
    @project = Project.new
    @project.bpm = project_params[:bpm].to_i
    @project.name = project_params[:name]
    @project.video = project_params[:video]
    @project.user = current_user

    if @project.save
      flash[:notice] = 'Post successfully created'
      render 'index'
    else
      # TODO: handle form validation stuff
      render 'layouts/error'
    end
  end

  def destroy
    @deleted_name = @project.name
    if @project.destroy
      render 'index'
    else
      render 'layouts/error'
    end
  end

  private

  def project_params
    params.require(:project).permit(:name, :bpm, :video)
  end

  def get_project
    @project = Project.find_by(id: params[:id])
  end
end
