require 'rubygems'

require 'uri'

require 'time'

require 'json'
require 'yajl/http_stream'

require 'erubis'
require 'sinatra/base'

require 'redis'

require 'lib/nozoki'
require 'lib/nozoki/http_server'
require 'lib/nozoki/twitter_streamer'

twitter_streamer = Nozoki::TwitterStreamer.new
twitter_streamer.run

http_server = Nozoki::HttpServer.new
run http_server
