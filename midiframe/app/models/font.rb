class Font < ApplicationRecord
  # TODO: security, font file type must be inspected and restricted
  has_one_attached :file

  def file_extension 
    "." + self.file.content_type.split("/").pop 
  end
end
