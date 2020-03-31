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


  get 'pattern-settings/:id/:project_id', to: 'patterns#pattern_settings'


  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
