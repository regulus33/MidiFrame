# frozen_string_literal: true

# recording all the midi here
class PatternsController < ApplicationController
  
  def new
    #Eventually for edit, we can calculate this based on prefs, but very much not a priority
    @current_index_in_notes_array = 4
    @midi_notes = Pattern::NOTES_GROUPED_IN_OCTAVES
    @final_index = ( @midi_notes.length - 1 )
    
    @pattern = Pattern.new(project: Project.find_by(id: params[:project_id]))
  end

  private

  def pattern_params
    params.require(:pattern).permit(:data, :used_notes)
  end
end
