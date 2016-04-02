productId = new ReactiveVar(null);
productName = new ReactiveVar(null);
productDescription = new ReactiveVar(null);

Meteor.subscribe('FeaturedProducts');

Tracker.autorun(function() {
  try {
    if (Meteor.user()){
      Meteor.subscribe('VendorPayouts');
    }
  } catch (e) {

  }
});


Tracker.autorun(function () {
  if (Meteor.userId()) {
    CART.signedIn();
  }
});

// Tracker.autorun(function(){
//   if(Roles.userHasRole(Meteor.userId(), 'user')){
//     var link = location.href;
//
//     if(link.search('admin') != -1){
//       Router.go('/');
//     }
//   }
// });
