Handlebars.registerHelper('noOfReviews', function (reviews) {
  if (reviews === undefined) {
    return "0";
  } else {
    return reviews.length;
  }
});
