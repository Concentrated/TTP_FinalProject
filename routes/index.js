var express = require('express');
var request = require('request');
var twilio = require('twilio');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/subscribe', function(req, res, next) {
	var number = req.body.number;

	var accountSid = 'AC695eb2fd0ce7e99037ce49e5ec212996';
	var authToken = '38d3c7ff1ccccff1e9249a3696e3e673'; 

	var client = new twilio.RestClient(accountSid, authToken);

	client.messages.create({
	    body: 'Thank you for subscribing to WeCast',
	    to: '+1'+number,  // Text this number
	    from: '+13473219737' // From a valid Twilio number
	}, function(err, message) {
	    if(err) {
	        console.error(err.message);
	    }
	});

	res.redirect(next);
});

router.post('/', function(req, res, next) {

	var location = req.body.location;

	request('http://dataservice.accuweather.com/locations/v1/search?q='+location+'&apikey=dQppL8SBJSK5tb2XyOqDrnSO3E5GjXlA', function(error, response, body) {

		var data = JSON.parse(body);

		// res.send(data[0].Key);
		var key = data[0].Key;
		console.log(key);

		request('http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/'+key+'?apikey=dQppL8SBJSK5tb2XyOqDrnSO3E5GjXlA', function(error, response, body) {

			var data = JSON.parse(body);

			console.log(data);
			
			var low, high, condition, rain;
			low = 1000; high = 0;
			condition = [];
			rain = [];
			for(index in data) {

				console.log(data[index]);
				if(data[index].Temperature.Value < low) {
					low = data[index].Temperature.Value;
				}
				if(data[index].Temperature.Value > high) {
					high = data[index].Temperature.Value;
				}

				var date = data[index].DateTime;

				var regex = "\\d{2}"+":"+"\\d{2}"+":"+"\\d{2}";

				data[index].DateTime = date.match(regex);
				// condition.push(data[index].IconPhrase);
				// rain.push(data[index].PrecipitationProbability);
			}
			var temp = {
				low: low,
				high: high
			};

			res.render('index', {info: data, temp: temp});

		});
	});
});

module.exports = router;


