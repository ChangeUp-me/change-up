(function () {
  
  function onload () {
  	Meteor.call('get_tweets', function (error, tweets) {
  		if(error) {
  			return console.error(error);
  		}

      var tweetElements = [], ele, $owl = $('#owl-example');

      tweets.forEach(function (val, indx) {
          $.ajax({
            method : 'GET',
            jsonp: "callback",
            dataType: "jsonp",
            data : {
              hide_media : true
            },
            url : 'https://api.twitter.com/1/statuses/oembed.json?url=https://twitter.com/Interior/status/' + val.id_str,
            success : function (response) {
              tweetElements.push(response.html);

              if(indx == tweets.length - 1) {
                tweetElements.forEach(function (html, indx) {
                  $owl.append('<div>' +html+ '</div>')
                })
                $owl.owlCarousel({
                  margin : 20
                });
              }
            }
          })
      });
  	})
  }

  function onloadError (error) {
  	console.error('failed to load twitter widget', error)
  }

  //Generate twitter widget script
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//platform.twitter.com/widgets.js';
  script.onload = onload;
  script.onerror = onloadError;

  Meteor.startup(function () {
    //Load the script tag
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  });

})();