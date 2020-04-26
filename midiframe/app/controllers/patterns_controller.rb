# frozen_string_literal: true

# recording all the midi here
class PatternsController < ApplicationController

  before_action :find_project
  before_action :find_pattern, only: ['edit', 'update', 'pattern_settings', 'destroy', 'generate_pattern_clip']
  protect_from_forgery with: :null_session, only: ['update']

  def index 
    @patterns = @project.patterns 
  end
  
  def new
    @pattern = Pattern.create(project: @project)
    redirect_to edit_project_pattern_path(@project, @pattern)
  end

  def pattern_settings 
  end

  def pattern_preview 
    
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
        @pattern.channel = pattern_params[:channel].to_i 
        @pattern.note_stamps = note_stamps_params
        # ? we reset array of midi events to empty if user submits a collection of events
        # ? because of that and just common sense in general, we never save "empty" values 
        # ? if user wants to clear midi events they can just delete the pattern 
        @pattern.midi_events_array = midi_events_params if midi_events_params.any?  
        @pattern.save!

        render :json => msg 
      end
      # ? currently this request originates only from pattern_settings, else it will be a JSON from pattern edit 
      format.html do
         @pattern.name = pattern_params[:name]
         @pattern.order_in_sequence = pattern_params[:order_in_sequence]
         @pattern.channel = pattern_params[:channel]
         @pattern.step_length_integer = pattern_params[:step_length].to_i 
         toast "#{@pattern.name} updated" if @pattern.save! 
         redirect_to edit_project_pattern_path(@project, @pattern) 
      end
    end
  end

  def destroy
   if @pattern.destroy!
    toast "#{@pattern.name} deleted"
    redirect_to project_patterns_path(@project)
   end 
  end

  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # ? POST: this will generate the clips for a single pattern
  def generate_pattern_clip 
    @pattern.create_clip 
  end

  private

  def pattern_params
    params.require(:pattern).permit(:data, :used_notes, :name, :order_in_sequence, :channel, :step_length)
  end
  # TODO: fix me before production
  # !Security 
  def midi_events_params  
    # params.require(:midiEvents).permit(:timestamp, :note)
    # params.require(:midiEvents).permit!
    params[:midiEvents]
  end
  
  # TODO: fix me before production
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
