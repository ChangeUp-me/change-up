Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM-DD-YYYY');
});

Template.registerHelper('pageTitle', function () {
  return this.pageTitle || Router.current().route.getName();
})

Template.registerHelper('productReviewStars', function(reviewObj) {
  var reviews = reviewObj.hash.reviews || [];
  var color = reviewObj.hash.color || 'red';

  var totalReviewRating = 0;

  //add up the rating from each review
  for (var i = 0; i < reviews.length; i++) {
    totalReviewRating += reviews[i].rating;
  }

  //get the average number of stars
  var total = Math.ceil(totalReviewRating / reviews.length);

  var stars = [];

  //we should never have more than 5 stars
  if (total > 5) {
    console.warn('total was greater than 5 stars: ' + total);
    total = 5;
  }

  //add stars to product object
  for (var i = 0; i < total; i++) {
    stars.push({
      color: color
    });
  }

  //for ever star missing add a grey star
  for (var i = 0; i < 5 - total; i++) {
    stars.push({
      color: 'gray'
    });
  }

  return stars;
})