FROM ruby:2.6
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client ffmpeg sox 
WORKDIR /usr/src/mid
COPY . . 
WORKDIR /usr/src/midiframe
# RUN bundle install
# Start the main process.
# CMD ["rails", "server", "-b", "0.0.0.0"]