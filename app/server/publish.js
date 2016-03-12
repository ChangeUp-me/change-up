Meteor.publish('FeaturedProducts', function(){
  return FeaturedProducts.find({'current': true});
})

Meteor.publish('VendorPayouts', function(){
  try {
    var vendorId = Meteor.users.findOne({"_id":this.userId}).profile.vendorId;
    if (vendorId) {
      return VendorPayouts.find({'vendorId':vendorId});
    }
  } catch (e) {

  }
});
