if (process.argv.length === 3) {
	var tweetBlink = require('./lib/tweet_blink');

	var config = tweetBlink.readConfiguration(process.argv[2]);
	tweetBlink.track(config);
} else {
	console.log('Usage: node index CONFIGURATION_FILE_PATH')
}