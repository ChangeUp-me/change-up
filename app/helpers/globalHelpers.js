Handlebars.registerHelper('noOfReviews', function (reviews) {
  console.log(reviews);
  if (reviews === undefined) {
    return "0 reviews";
  } else if (reviews.length === 1 ) {
    return (reviews.length +" review");
  } else {
    return (reviews.length +" reviews");
  }
});

Handlebars.registerHelper('noOfReviewsNoText', function (reviews) {
  console.log(reviews);
  if (reviews === undefined) {
    return "0";
  } else {
    return (reviews.length);
  }
});
