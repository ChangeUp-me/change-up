(function () {

  function onloadError (error) {
  	console.error('failed to load twitter widget', error)
  }

  //Generate twitter widget script
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//platform.twitter.com/widgets.js';
  script.onerror = onloadError;

  Meteor.startup(function () {
    //Load the script tag
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  });

})();