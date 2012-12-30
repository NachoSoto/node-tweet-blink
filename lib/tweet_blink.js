var fs = require('fs');
var Twit = require('twit');
var Blink1 = require('node-blink1').Blink1;

var CONFIG_FILE = '.tweet-blink.json';

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
		var color = colorForTweet(t.text);

		console.log(t.text);

		blink.setRGB.apply(blink, color);

		fadeOutAfter(1000);
	});

	function fadeOutAfter(interval) {
		var fadeTimeout = null;

		return (function() {
			if (fadeTimeout) {
				clearInterval(fadeTimeout);
			}

			fadeTimeout = setTimeout(function() {
				blink.fadeToRGB(300, 0, 0, 0);
				fadeTimeout = null;
			}, interval);
		})();
	}

	function colorForTweet(text) {
		for (var key in keywords) {
			var re = new RegExp(key, 'gi');

			if (text.match(re)) {
				return keywords[key];
			}
		}

		return [0, 0, 0];
	}
};

exports.readConfiguration = function() {
	var conf;

	try {
		var path = (process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']) + '/' + CONFIG_FILE;

		// purposely doing this synchronously
		conf = fs.readFileSync(path, 'utf8');
	} catch (e) {
		console.error('You need to create a configuration file ' + CONFIG_FILE + ' in your home directory');
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