require 'sinatra'
require 'slim'

Slim::Engine.set_default_options :pretty => true

get '/hi' do
  "Hello World\n"
end

get '/page' do
  "<html><body><h1>Hello World!</h1></body></html>"
end

get '/template' do
  slim :inline_template
end

get '/file' do
  slim :file
end
__END__

@@inline_template

h1
  | Hello World!!!
