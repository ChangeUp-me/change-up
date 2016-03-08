productId = new ReactiveVar(null);
productName = new ReactiveVar(null);
productDescription = new ReactiveVar(null);

Meteor.subscribe('FeaturedProducts');


Tracker.autorun(function () {
  if (Meteor.userId()) {
    CART.signedIn();
  }
});
