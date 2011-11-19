require 'rubygems'
require 'sinatra'

public_dir = 'game'

get '/' do
  begin
    File.read File.join(public_dir, 'index.html')
  rescue
    "Hi there, You're missing an index.html file."
  end
end

not_found do
  begin
    File.read File.join(public_dir, '404.html')
  rescue
    'This is nowhere to be found'
  end
end

error 400..510 do
  begin
    File.read File.join(public_dir, '500.html')
  rescue
    'Boom'
  end
end