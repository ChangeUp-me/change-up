Handlebars.registerHelper('noOfReviews', function (reviews) {
  if (reviews === undefined) {
    return "0 reviews";
  } else if (reviews.length === 1 ) {
    return (reviews.length +" review");
  } else {
    return (reviews.length +" reviews");
  }
});

Handlebars.registerHelper('noOfReviewsNoText', function (reviews) {
  if (reviews === undefined) {
    return "0";
  } else {
    return (reviews.length);
  }
});

Handlebars.registerHelper('admin', function () {
  if (Meteor.user().roles[0] === "admin"){
    return true;
  }
});


Handlebars.registerHelper('productLink', function () {
  return (document.location.origin+'/item/'+productId.get());
});

Handlebars.registerHelper('productName', function () {
  return productName.get();
});

Handlebars.registerHelper('productDescription', function () {
  try {
    return (productDescription.get()).replace(/ /g,'%20');
  } catch (e) {

  }
});
