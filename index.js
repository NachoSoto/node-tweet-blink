var Twit = require('twit');
var Blink1 = require('node-blink1').Blink1;

var T = new Twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_SECRET
});
var blink = new Blink1();

var tracking = {
	'@NachoSoto': [255, 0, 0]
};

function track() {
	var stream = T.stream('statuses/filter', {
		track: Object.keys(tracking)
	});

	stream.on('tweet', function(t) {
		var color = colorForTweet(t.text);

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
		for (var key in tracking) {
			var re = new RegExp(key, 'gi');

			if (text.match(re)) {
				return tracking[key];
			}
		}

		return [0, 0, 0];
	}
}

track();