require 'pry'

path = '../assets/video_bank'

files_to_concat = []
Dir.entries(path).each do |s|
    next if [".", "..",".DS_Store"].include?(s)
    file = path + "/" + s  
    if s.split(".").pop != "MTS"
    #FIRST CONVERT EVERYTHING TO MTS https://video.stackexchange.com/questions/15468/non-monotonous-dts-on-concat-ffmpeg
    new_file = path + "/" + s.split(".").shift + ".MTS"
    files_to_concat << new_file 
    `ffmpeg -i #{file} -q 0 #{new_file}`
    else 
        files_to_concat << path + '/' + s 
    end 
end 
input_text = ""

files_to_concat.each do |d|
    puts "writing files to input #{d}"
    input_text << "file " + "'" + d + "'\n" 
end
puts 'writing input'
File.open('input.txt', 'w') { |file| file.write(input_text) }
puts 'running ffmpeg'
`ffmpeg -f concat -safe 0 -i input.txt -c copy jumble.MTS`
