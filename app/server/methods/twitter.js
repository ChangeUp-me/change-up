Meteor.methods({
	get_tweets : function () {
		var $response = new Future();
		var promises = [];
		var charityUsernames = ['charitywater', 'MentalHealthAm', 'rainforestus'];

		_.each(charityUsernames, function (username) {
			var prom = new Promise(function (resolve, reject) {
				Twit.get('statuses/user_timeline', {
					screen_name : username,
					count : 5
				}, function (err, data, response) {
					if(err) {
						return reject(err);
					}

					//https://api.twitter.com/1/statuses/oembed.json?id=712011030923075600

					//only get the id of each tweet
					data = _.map(data, function (tweet) {
						return _.pick(tweet, ['id_str'])
					})

					resolve(data);
				});
			});

			promises.push(prom);
		});

		var getTweets = Promise.all(promises).then(function (tweets){
			$response.return(_.flatten(tweets));
		}, function (reason) {
			$response.throw(reason);
		})

		return $response.wait();
	}
})