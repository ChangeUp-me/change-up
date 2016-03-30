Meteor.methods({
  updateAccount:function(updates) {
    Meteor.users.update({
      _id : Meteor.userId()
    }, {
      $set : {
        'profile.name' : updates.name,
        'profile.phone' : updates.phone
      }
    })
  },
  updateBilling:function(updates) {
    Meteor.users.update({
      _id : Meteor.userId()
    }, {
      $set : {
        'profile.shipping.fullName' : updates.shippingName,
        'profile.shipping.addressOne' : updates.shippingStreet,
        'profile.shipping.city' : updates.shippingCity,
        'profile.shipping.state' : updates.shippingState,
        'profile.shipping.zipcode' : updates.shippingZip,
        'profile.billing.fullName' : updates.billingName,
        'profile.billing.addressOne' : updates.billingStreet,
        'profile.billing.city' : updates.billingCity,
        'profile.billing.state' : updates.billingState,
        'profile.billing.zipcode' : updates.billingZip
      }
    });
  }
});
