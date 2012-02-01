require 'sinatra'
require 'open-uri'
require './helpers'

configure :development do |config|
  require 'sinatra/reloader'
  config.also_reload "*.rb"
end

get '/' do
  erb :application
end

get '/default_text' do
  content_type "text/plain"
  File.read( File.join( APP_ROOT, 'lib', 'default_text.txt' ) )
end

get '*.js' do
  content_type "application/javascript"
  File.read( File.join(File.dirname(__FILE__), 'script', params[:splat].join('/') << '.js') )
end

get '/js/*' do
  content_type "application/javascript"
  params[:splat].map { |paths| paths.split('/') }.flatten.map do |path|
    path = File.join( APP_ROOT, 'script', path.gsub('!SEP!', '/') << '.js' )
    begin
      File.read path
    rescue
      "// Failed to load: #{path}"
    end
  end.join("\n")
end

get '*.css' do
  content_type 'text/css'
  sass params[:splat].join('').to_sym
end

get '/fonts/*.ttf' do
  content_type 'text/plain'
  File.read File.join( APP_ROOT, 'fonts', params[:splat].join('/') << '.ttf' )
end
