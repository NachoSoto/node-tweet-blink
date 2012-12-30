var fs = require('fs');
var Twit = require('twit');
var Blink1 = require('node-blink1').Blink1;

var T = new Twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_SECRET
});
var blink = new Blink1();

exports.track = function(keywords) {
	var words = Object.keys(keywords);

	var stream = T.stream('statuses/filter', {
		track: words
	});

	stream.on('connect', function() {
		console.log('Tracking: ' + words.toString());
	});

	stream.on('disconnect', function(msg) {
		console.error('Stream disconnected: ' + msg);
	});

	stream.on('tweet', function(t) {
		console.log(t.text);

		var color = colorForTweet(t);

		blink.setRGB.apply(blink, color);
		fadeOutAfter(1000);
	});

	var fadeOutAfter = (function() {
		var fadeTimeout = null;

		return function(interval) {
			if (fadeTimeout) {
				clearTimeout(fadeTimeout);
			}

			fadeTimeout = setTimeout(function fadeOut() {
				blink.fadeToRGB(300, 0, 0, 0);
			}, interval);
		}
	})();

	function colorForTweet(tweet) {
		var textToLookFor = tweet.text +
			tweet.retweeted_status.text +
			tweet.entities.urls.map(function(v) {
			return v.expanded_url;
		}).toString();

		for (var key in keywords) {
			if (keywords.hasOwnProperty(key)) {
				var re = new RegExp(key, 'gi');

				if (textToLookFor.match(re)) {
					return keywords[key];
				}
			}
		}

		return [0, 0, 0];
	}
};

exports.readConfiguration = function(filePath) {
	var conf;

	try {
		// purposely doing this synchronously
		conf = fs.readFileSync(filePath, 'utf8');
	} catch (e) {
		console.error('Configuration file ' + filePath + ' not found');
		process.exit(1);
	}

	try {
		conf = JSON.parse(conf);
	} catch (e) {
		console.error('Invalid configuration file');
		process.exit(1);
	}

	return conf;
};