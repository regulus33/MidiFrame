class PatternsController < ApplicationController

  def new  
    @pattern = Pattern.new(params[:id]) 
  end 

  private

  def pattern_params
    params.require(:pattern).permint(:data, :used_notes)
  end 
    
end 