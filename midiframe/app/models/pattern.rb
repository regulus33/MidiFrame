# frozen_string_literal: true

class Pattern < ApplicationRecord
  belongs_to :project
  # all note numbers that we will support, normally there are 0-128 but Id rather keep things as simple as possible and ,ake the end result evenly divisible by twelve, which is how many notes we keep in our on screen keyboard 
  NOTES_GROUPED_IN_OCTAVES = [
    [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 
    [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], 
    [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], 
    [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 
    [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], 
    [72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83], 
    [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95], 
    [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107], 
    [108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]
  ]
   

end
