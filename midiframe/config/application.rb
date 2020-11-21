# frozen_string_literal: true

require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Midiframe
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.active_job.queue_adapter = :sidekiq
    # !a workaround to get around cors error for dev and test
    # ? https://medium.com/@Nicholson85/handling-cors-issues-in-your-rails-api-120dfbcb8a24
    # unless (Rails.env.production?)
    #   config.middleware.insert_before 0, Rack::Cors do
    #     allow do
    #       origins "*"
    #       resource "*", :headers => :any, :methods => [:get, :post, :options]
    #     end
    #   end
    # end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
  end
end
