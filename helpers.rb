module Sinatra::Helpers

  APP_ROOT = File.dirname(__FILE__)

  class JavaScriptRequire
    attr_accessor :orig_path
    def initialize(path)
      @path = @orig_path = path.to_s
    end

    def external?
      @path.match /^(http|www)/
    end

    def full_path?
      @path.match /\.js$/
    end

    def path
      if external?
        @path
      else
        full_path? ? @path : @path.sub(/$/, '.js')
      end
    end

    def content
      if external?
        begin
          @content ||= File.read( open(path) )
        rescue OpenURI::HTTPError
          @content ||= "404"
        end
      else
        local_path = File.join(APP_ROOT, 'script', path)
        @content ||= File.read( local_path ) if File.exists? local_path
      end
    end

    def include_tag
      "<script type='text/javascript' src='#{path}'></script>"
    end

    def embed_tag
      if content
        "<script type='text/javascript'>\n#{content}\n</script>"
      end
    end

    def <=>(other)
      if external? and other.external?
        0
      elsif external?
        -1
      elsif other.external?
        1
      else
        0
      end
    end
  end

  def javascript(*args)
    @javascript_paths ||= []

    unless args.empty?
      args.map do |path|
        next if @javascript_paths.map(&:orig_path).include? path
        @javascript_paths << JavaScriptRequire.new(path)
      end
      return ''
    else
      @javascript_paths.compact.sort { |a,b| a <=> b }.collect do |path|
        if production?
          path.embed_tag
        else
          path.include_tag
        end
      end.join("\n")
    end
  end

  def css(*args)
    @css_paths ||= []

    unless args.empty?
      args.map! &:to_s
      args.map do |path|
        next if @css_paths.include? path
        @css_paths << path.sub(/(\.css|$)/, '.css')
      end
      return ''
    else
      @css_paths.compact.collect do |path|
        "<link rel='stylesheet' type='text/css' href='#{path}' />"
      end.join("\n")
    end
  end

end
