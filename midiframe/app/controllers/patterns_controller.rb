# frozen_string_literal: true

# recording all the midi here
class PatternsController < ApplicationController

  before_action :find_project
  before_action :find_pattern, only: ['edit', 'update', 'pattern_settings']
  protect_from_forgery with: :null_session, only: ['update']

  def index 
    @patterns = @project.patterns 
  end
  
  def new
    if @project.patterns.any?
      redirect_to project_patterns_path()
    else 
      @pattern = Pattern.create(project: @project)
      redirect_to edit_project_pattern_path(@project, @pattern)
    end
  end

  def pattern_settings 
  end

  def edit 
    #Eventually for edit, we can calculate this based on prefs, but very much not a priority
    @current_index_in_notes_array = 4
    @midi_notes = Pattern::NOTES_GROUPED_IN_OCTAVES
    @final_index = ( @midi_notes.length - 1 )
  end 

  def update
    msg = { :status => "ok", :message => "Success!", :html => "<b>...</b>" }
    # TODO actually save stuff here

    respond_to do |format|
      format.json  do 
        # ? in this screen (the edit pattern screen) there are only 3 editable fields
        # *midi_events,
        # *note_stamps
        # *channel

        binding.pry 
        @pattern.channel = pattern_params[:channel].to_i 
        @pattern.note_stamps = note_stamps_params
        @pattern.midi_events = midi_events_params
        @pattern.save!

        render :json => msg 
      end# don't do msg.to_json
      format.html do
         @pattern.name = pattern_params[:name]
         @pattern.order_in_sequence = pattern_params[:order_in_sequence]
         @pattern.channel = pattern_params[:channel]
         @pattern.step_length = pattern_params[:step_length]
         toast "#{@pattern.name} updated" if @pattern.save! 
         redirect_to edit_project_pattern_path(@project, @pattern) 
      end
    end
  end

  private

  def pattern_params
    params.require(:pattern).permit(:data, :used_notes, :name, :order_in_sequence, :channel, :step_length)
  end

  # !Security 
  def midi_events_params  
    # params.require(:midiEvents).permit(:timestamp, :note)
    # params.require(:midiEvents).permit!
    params[:midiEvents]
  end
  
  # ! ALERT THIS COULD BE EXTREMELY DANGEROUS IN PRODUCTION. DO NOT FORGET TO SCRUB THESE PARAMS
  # ! all manner of keys can be added here which will be injected directly into the DB! 
  # !Security
  def note_stamps_params 
    # params.require(:piandData).permit!
    params[:pianoData]
  end

  def find_project 
   @project = Project.find_by(id: params[:project_id])
  end

  def find_pattern
    @pattern = Pattern.find_by(id: params[:id])
  end

end
