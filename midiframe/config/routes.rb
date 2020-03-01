Rails.application.routes.draw do
  get 'main/index'

  #PROJECTS 
  #PROJECTS 
  #PROJECTS 
  root to: 'projects#index'

  resources :projects do  
    resources :patterns 
  end 

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
