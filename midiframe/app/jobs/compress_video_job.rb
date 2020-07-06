class CompressVideoJob < ApplicationJob
  queue_as :default
  # TODO: perhaps not relevant after adding native player for local files
  def perform(video_id, project_id)
    project = Project.find(project_id)
    video_to_change = Video.find video_id
    video_to_change.compress(new_project_to_add_output_to: project)
  end

end
