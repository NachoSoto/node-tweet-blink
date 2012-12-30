var tweetBlink = require('./lib/tweet_blink');

var config = tweetBlink.readConfiguration();
tweetBlink.track(config);