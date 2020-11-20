FactoryBot.define do
  factory :user do
    email { "test@example.com" }
    password { "f4k3p455w0rd" }
    # using dynamic attributes over static attributes in FactoryBot

    # if needed
    # is_active true
  end
end
