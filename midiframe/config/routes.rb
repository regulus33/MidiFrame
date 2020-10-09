# frozen_string_literal: true
require "sidekiq/web"

Rails.application.routes.draw do
  devise_for :users
  root to: "sessions#about"
  # SIGN IN AND SIGN UP
  # resources :users, only: %i[new create]
  # get "login", to: "sessions#new"
  # post "login", to: "sessions#create"
  # just a simple link should sign user out
  get "logout", to: "sessions#delete"
  get "unauthorized", to: "sessions#page_requires_login"
  # ALL PATTERNS
  #
  #
  get "patterns/all", to: "patterns#patterns_all"
  # PROJECTS
  #
  #
  resources :projects do
    resources :patterns
  end
  get "autotune/:id", to: "projects#autotune"
  put "autotune/:id", to: "projects#autotune_generate"
  # PATTERNS
  #
  #
  get "pattern-preview/:id/:project_id", to: "patterns#pattern_preview", as: "pattern_preview"
  get "pattern-settings/:id/:project_id", to: "patterns#pattern_settings"
  post "pattern-generate/:id/:project_id", to: "patterns#generate_pattern_clip"

  #videos
  get "videos", to: "videos#index"

  # TODO: security make this private once production
  mount Sidekiq::Web => "/sidekiq"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # public
  get "about", to: "sessions#about"
end
