require 'sinatra'
require 'open-uri'
require './helpers'

APP_ROOT = File.dirname(__FILE__)

configure :production do
  require 'newrelic_rpm'
end

configure :development do |config|
  require 'sinatra/reloader'
  config.also_reload "*.rb"
end

get '/' do
  erb :application
end

get '/hangman' do
  erb :hangman
end

get '/test' do
  erb :test
end

get '/default_text' do
  content_type "text/plain"
  text = Lipsum.new.paragraphs[2].to_s
  text = text.slice(57, text.length)
end

get '*.js' do
  content_type "application/javascript"
  path = File.join(File.dirname(__FILE__), 'script', params[:splat].join('/') << '.js')
  File.exists?(path) ? File.read(path) : "console.error('No such file: #{path}');"
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
  css_path = File.join( APP_ROOT, 'views', params[:splat].join('') ) << '.css'
  if File.exists?(css_path)
    File.read(css_path)
  else
    sass params[:splat].join('').to_sym
  end
end

get '/fonts/*.ttf' do
  content_type 'text/plain'
  File.read File.join( APP_ROOT, 'fonts', params[:splat].join('/') << '.ttf' )
end
