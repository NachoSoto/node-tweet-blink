node-tweet-blink
================

Real time visualization of tweets using blink(1)

### Usage:
All you need is a configuration file like:
```json
{
	"iphone": [255, 0, 0],
	"ipad": [0, 255, 0],
	"javascript": [0, 0, 255]
}
```
where you specify the keywords to track and the colors associated with them.

And then run it: ```$ tweet-blink```

### Installation:
- npm install -g tweet-blink
- Copy ```tweet-blink.json.sample``` to ```~/.tweet-blink.json```
- Add ```TWITTER_CONSUMER_KEY```, ```TWITTER_CONSUMER_SECRET```, ```TWITTER_ACCESS_TOKEN``` and ```TWITTER_ACCESS_SECRET``` to your environment variables.
- Run ```node-tweet```.