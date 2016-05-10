Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM-DD-YYYY');
});

Template.registerHelper('https', function(website) {
  if (website.substring(0,5) !== "https" && website.substring(0,4) === "http") {
    return "https"+website.substring(4);
  } else if (website.substring(0,5) === "https") {
    return website;
  } else {
    // return "https://"+website;
    return website;
  }
});

Template.registerHelper('http', function(website) {
  if (website.substring(0,4) !== "http") {
    return "http://"+website;
  } else {
    return website;
  }
});

Template.registerHelper('pageTitle', function () {
  return this.pageTitle || Router.current().route.getName();
})

Template.registerHelper('featuredProductsTime', function () {

  var then = Date.parse(FeaturedProducts.findOne({'current':true}).date);
  var now = Date.now();
  var diff = then-now;

  var hours = moment(diff).hours();
  var minutes = moment(diff).minutes();

  return hours + 'h ' + minutes + 'm';
})

Template.registerHelper('productReviewStars', function(reviewObj) {
  var reviews = reviewObj.hash.reviews || [];
  var color = reviewObj.hash.color || 'red';
  var stars = [];
  var totalReviewRating = 0;

  //add up the rating from each review
  for (var i = 0; i < reviews.length; i++) {
    totalReviewRating += reviews[i].rating || 0;
  }

  //get the average number of stars
  //--> hahahaha ASK SIRI WHAT 0/0 IS!!!
  var total = Math.ceil(totalReviewRating / reviews.length) || 0;

  //we should never have more than 5 stars
  if (total > 5) total = 5;

  //add stars to product object
  for (var i = 0; i < total + (5 - total); i++) {
    if(i < total) {
      stars.push({color: color});
    } else {
      stars.push({color: 'gray'});
    }
  }

  return stars;
})
