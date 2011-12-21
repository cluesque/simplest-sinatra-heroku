require 'sinatra'

get '/hi' do
  "Hello World\n"
end

get '/page' do
  "<html><body><h1>Hello World!</h1></body></html>"
end
