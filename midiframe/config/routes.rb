# frozen_string_literal: true

Rails.application.routes.draw do
  get 'main/index'

  # PROJECTS
  # PROJECTS
  # PROJECTS
  root to: 'projects#index'

  resources :projects do
    resources :patterns
  end


  get 'pattern-preview/:id/:project_id', to: 'patterns#pattern_preview', as: 'pattern_preview'

  get 'pattern-settings/:id/:project_id', to: 'patterns#pattern_settings'

  post 'pattern-generate/:id/:project_id', to: 'patterns#generate_pattern_clip'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
