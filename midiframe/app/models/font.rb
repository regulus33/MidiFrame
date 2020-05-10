class Font < ApplicationRecord
  # TODO: security, font file type must be inspected and restricted
  has_one_attached :file

end
