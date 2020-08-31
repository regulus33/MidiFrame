# frozen_string_literal: true

# Simple Controller For HTTP CRUD Patterns  
class PatternsController < ApplicationController
  before_action :find_project
  before_action :find_pattern, only: %w[edit update pattern_settings destroy generate_pattern_clip pattern_preview]
  protect_from_forgery with: :null_session, only: ['update']

  def index
    params[:page_title] = "Saved Patterns For #{@project.name}"
    @patterns = @project.patterns
  end

  def new
    @pattern = Pattern.create(project: @project)
    redirect_to edit_project_pattern_path(@project, @pattern)
  end

  def pattern_settings; end

  def pattern_preview; end

  def edit
    # Eventually for edit, we can calculate this based on prefs, but very much not a priority
    @notes_in_which_octave_identifier = Pattern::NOTES_IN_WHICH_OCTAVE_IDENTIFIER.to_json
    # TODO: save this somewhere so you dont need to nav to it each time
    @current_index_in_notes_array = 4
    @midi_notes = Pattern::NOTES_GROUPED_IN_OCTAVES
    # todo, don't calculate num that is always the same
    @final_index = (@midi_notes.length - 1)
  end
  
  # PUT /projects/:project_id/patterns/:id(.:format)
  # `params: { pattern: channel: "1",  pianoData: { '13': 345.7778 }, pianoTextData: {'13' : 'Blammo!'}, order_in_sequence: 1, name: 'dope pattern', step_length: 4}`
  def update
    # for json response 
    msg = { status: 'ok', message: 'Success!', html: '<b>...</b>' }

    respond_to do |format|
      format.json do
        # ? in this screen (the edit pattern screen) there are only 3 editable fields
        # *midi_events,
        # *note_stamps
        # *channel
        binding.pry 
        @pattern.midi_source = midi_type_params
        @pattern.channel = pattern_params[:channel].to_i
        @pattern.note_stamps = note_stamps_params
        @pattern.text_stamps = text_stamps_params
        # ? we reset array of midi events to empty if user submits a collection of events
        # ? because of that and just common sense in general, we never save "empty" values
        # ? if user wants to clear midi events they can just delete the pattern
        @pattern.midi_events_array = midi_events_params if midi_events_params.any?
        @pattern.save!
        msg
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
  
  # DELETE /projects/:project_id/patterns/:id(.:format)
  def destroy
    if @pattern.destroy!
      toast "#{@pattern.name} deleted"
      redirect_to project_patterns_path(@project)
    end
  end

  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE
  # * END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE END GOAL HERE

  # POST 'pattern-generate/:id/:project_id'
  # generates the video 
  def generate_pattern_clip
    @pattern.assemble_pattern_video
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

  def midi_type_params 
    params[:midiType]
  end

  def text_stamps_params
    params[:pianoTextData]
  end

  def find_project
    @project = Project.find_by(id: params[:project_id])
  end

  def find_pattern
    @pattern = Pattern.find_by(id: params[:id])
  end
end
