require "rails_helper"

RSpec.describe "Hello world", type: :system do
  describe "index page" do
    it "shows the right content" do
      # logs in user
      user = FactoryBot.create(:user)
      user.confirmed_at = Time.now
      user.save
      login_as(user, :scope => :user)
      # end

      visit videos_new_path
      expect(page).to have_content("Hello, world!")
    end
  end
end
