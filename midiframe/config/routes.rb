# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  # SIGN IN AND SIGN UP
  resources :users, only: %i[new create]
  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  # just a simple link should sign user out
  get 'logout', to: 'sessions#delete'
  get 'unauthorized', to: 'sessions#page_requires_login'

  # PROJECTS
  root to: 'projects#index'

  resources :projects do
    resources :patterns
  end

  get 'pattern-preview/:id/:project_id', to: 'patterns#pattern_preview', as: 'pattern_preview'
  get 'pattern-settings/:id/:project_id', to: 'patterns#pattern_settings'
  post 'pattern-generate/:id/:project_id', to: 'patterns#generate_pattern_clip'
  # TODO: security make this private once production
  mount Sidekiq::Web => '/sidekiq'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
