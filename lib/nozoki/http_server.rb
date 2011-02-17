module Nozoki
  class HttpServer < Sinatra::Base
    set :public, Proc.new { File.join("public") }

    configure do
      @@redis = Redis.new
    end

    get '/' do
      erubis :index
    end

    get '/pulse' do
      content_type :json

      results = []

      @@redis.smembers("records").each do |record|
        results << Yajl::Parser.new.parse(record).merge({:r => rand(255), :g => rand(255), :b => rand(255), :a => rand(255)})
      end

      results.to_json
    end

    get "/loc/:term" do |term|
      content_type :json

      puts term

      results = []

      @@redis.smembers("records").each do |record|
        tmp = Yajl::Parser.new.parse(record)
        results << {:x => tmp["x"], :y => tmp["y"], :r => rand(255), :g => rand(255), :b => rand(255), :a => 255} if tmp["text"][/#{term}/]
      end

      results.to_json
    end
  end
end
