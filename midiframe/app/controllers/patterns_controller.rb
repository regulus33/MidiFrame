# frozen_string_literal: true

# recording all the midi here
class PatternsController < ApplicationController

  before_action :find_project
  before_action :find_pattern, only: ['edit', 'update']
  
  def new
    @pattern = Pattern.create(project: @project)
    redirect_to edit_project_pattern_path(@project, @pattern)
  end

  def edit 
    #Eventually for edit, we can calculate this based on prefs, but very much not a priority
    @current_index_in_notes_array = 4
    @midi_notes = Pattern::NOTES_GROUPED_IN_OCTAVES
    @final_index = ( @midi_notes.length - 1 )
  end 
  

  def update
    json_response(@todo, :created)
  end

  private

  def pattern_params
    params.require(:pattern).permit(:data, :used_notes)
  end

  def find_project 
   @project = Project.find_by(id: params[:project_id])
  end

  def find_pattern
    @pattern = Pattern.find_by(id: params[:project_id])
  end

end
