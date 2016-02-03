Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM-DD-YYYY');
});

Template.registerHelper('pageTitle', function () {
  return this.pageTitle || Router.current().route.getName();
})

Template.registerHelper('featuredTime', function (date) {
  if(!date)return;

  var then = date;
  var now = Date.now();

  var hours = moment(then).diff(now, 'hours');
  var minutes =  moment(then).diff(now, 'minutes');

  return hours + 'h ' + (minutes - (60 * hours)) + 'm';
})

Template.registerHelper('featuredProductsTime', function () {

  var then = FeaturedProducts.findOne({'current':true}).date;
  var now = Date.now();

  var hours = moment(then).diff(now, 'hours');
  var minutes =  moment(then).diff(now, 'minutes');

  return hours + 'h ' + (minutes - (60 * hours)) + 'm';
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
