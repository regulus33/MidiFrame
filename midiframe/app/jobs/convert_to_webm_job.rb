class ConvertToWebmJob < ApplicationJob
  queue_as :urgent

  def perform(video_id, project_id, user_id)
    video_to_change = Video.find video_id
    
  end

end
