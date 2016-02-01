Meteor.publish('FeaturedProducts', function(){
  return FeaturedProducts.find({'current': true});
})
