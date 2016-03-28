(function () {
  
  function onload () {
  	console.log('calling after load');
  	Meteor.call('get_tweets', function (error, tweets) {
  		if(error) {
  			return console.error(error);
  		}

  		console.log('teh tweets', tweets);
  		Session.set('news_tweets', tweets);

  		twttr.widgets.createTweet(tweets[0].id_str, $('#firstweet')[0], {
  				align : "left",
  				size : "large"
  		}).then(function (el) {
  			console.log('the element ', el);
  			$(".owl-carousel").owlCarousel({});
  		})

  		console.log('getting session', Session.get('news_tweets'));
  	})
  }

  function onloadError (error) {
  	console.log('failed to load twitter widget', error)
  }

  //Generate a script tag
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//platform.twitter.com/widgets.js';
  script.onload = onload;
  script.onerror = onloadError;

  Meteor.setTimeout(function () {
  	console.log('this ran');
  })

  Meteor.startup(function () {
  	console.log('attempting to load');
    //Load the script tag
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  });

})();