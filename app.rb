require 'bundler/setup'
Bundler.require

configure :development do |config|
  require 'sinatra/reloader'
  config.also_reload "*.rb"
end

assets = Sprockets::Environment.new do |env|
  env.logger = Logger.new(STDOUT)
end

paths = %w{ javascripts stylesheets images }
paths.each do |path|
  assets.append_path("public/assets/#{path}")
end

module AssetHelpers
  def asset_path(name)
    "/assets/#{name}"
  end
end

helpers do
  include AssetHelpers
end

get '/assets/*' do
  new_env = env.clone
  new_env["PATH_INFO"].gsub!("/assets", "")
  assets.call(new_env)
end

get '/' do
  haml :application
end
