require 'pry'
path = '../assets/video_bank'
Dir.entries(path).each do |s|
    next if [".", "..",".DS_Store"].include?(s)
    next if s.include?('no_sound')
    ext = s.split(".").pop 
    `ffmpeg -i #{path + "/" + s} -c copy -an #{path + "/" + s}_no_sound.#{ext}`
    puts "CONVERTING #{s} to #{s}_no_sound.#{ext}"
end 