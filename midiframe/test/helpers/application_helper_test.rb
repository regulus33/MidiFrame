
class ApplicationHelperTest < ActionView::TestCase

  test "determine_appropriate_heading" do
    determine_appropriate_heading action: "index", controller: "patterns"
  end

end