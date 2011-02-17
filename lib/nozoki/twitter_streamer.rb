module Nozoki
  class TwitterStreamer
    def initialize
      puts "init"
      @redis = Redis.new
    end

    def run
      uri  = URI.parse("http://#{USERNAME}:#{PASSWORD}@stream.twitter.com/1/statuses/filter.json")
      body = 'locations=128,30,132.407227,33.998027,130.803223,32.62087,143.217773,41.738528,139.394531,41.079351,146.25,45.490946'

      lon_degree = (147.0 - 128) / DISPLAY_WIDTH
      lat_degree =  (45.5 -  30) / DISPLAY_HEIGHT

      Thread.new do
        Yajl::HttpStream.post(uri, body) do |status|
          lat, lon = status["geo"]["coordinates"]

          x = ((lon.to_f - 128) / lon_degree).to_i
          y = DISPLAY_HEIGHT - ((lat.to_f -  30) / lat_degree).to_i

          record = {
            :x    => x,
            :y    => y,
            :lat  => lat,
            :lon  => lon,
            :text => status["text"],
            :time => Time.parse(status["created_at"]).utc.to_i
          }

          @redis.sadd("records", Yajl::Encoder.encode(record))

          puts record.inspect
        end
      end
    end
  end
end
