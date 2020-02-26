class ProjectsController < ApplicationController

    before_action :get_project, only: [:edit, :update]

    def index 
        @projects = current_user.projects 
        redirect_to projects_new_path if @projects.empty? 
    end 

    def edit 
    end 

    def new 
        @project = Project.new(user: current_user, bpm: 120)
    end 

    def update
        @project.bpm = project_params[:bpm].to_i 
        @project.name = project_params[:name] 

        if @project.save 
            flash[:notice] = "Post successfully created"
            render 'index'
        else 
            #TODO: handle form validation stuff
        end 
    end 

    def create 
        @project = Project.new 
        @project.bpm = project_params[:bpm].to_i 
        @project.name = project_params[:name] 
        @project.user = current_user

        if @project.save 
            flash[:notice] = "Post successfully created"
            render 'index'
        else 
            #TODO: handle form validation stuff
        end 
    end 

    private 

    def project_params
        params.require(:project).permit(:name, :bpm)
    end  

    def get_project
        @project = Project.find_by(id: params[:id])
    end


end
