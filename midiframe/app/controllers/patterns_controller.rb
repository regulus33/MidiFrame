# frozen_string_literal: true

# recording all the midi here
class PatternsController < ApplicationController
  def new
    @pattern = Pattern.new(project: Project.find_by(id: params[:project_id]))
  end

  private

  def pattern_params
    params.require(:pattern).permit(:data, :used_notes)
  end
end
