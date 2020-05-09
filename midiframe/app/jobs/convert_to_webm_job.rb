class ConvertToWebmJob < ApplicationJob
  queue_as :default

  def perform(video_id, project_id)
    project = Project.find(project_id)
    video_to_change = Video.find video_id
    video_to_change.convert_to_webm(new_project_to_add_output_to: project)
  end

end
