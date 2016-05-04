Meteor.methods({
  vendorPayout:function(token_id) {
    if (Meteor.users.findOne({_id:Meteor.userId()}).profile.vendorId) {
      if(token_id != null || token_id != "" || token_id != undefined) {
        var profile = Meteor.users.findOne({_id:Meteor.userId()});
        var vendor = Vendors.findOne({_id:profile.profile.vendorId});
        var stripe = Meteor.npmRequire("stripe")("sk_live_rNjG94LGyl52oDz7ZMTCSilq");

        stripe.recipients.create({
          name: vendor.storeName,
          type: "corporation",
          bank_account: token_id,
          email: profile.emails[0].address,
        }, function(err, recipient) {
          var Fiber = Meteor.npmRequire('fibers');
          Fiber(function() {
            Meteor.users.update({_id:profile._id}, {$set: {'profile.stripe.recipient':recipient.id, 'profile.stripe.bank_account':recipient.active_account.id}});
            Vendors.update({_id : vendor._id}, {$set: {'stripe.recipient':recipient.id, 'stripe.bank_account':recipient.active_account.id}});
          }).run();
        });
      }
    }
  },
  getShippingRates : function (transactionId, parcelObj, shippingFromObj) {
    var shipping = new SHIPPING(Meteor.user(), "pR6aTPWO32kIqYdpKSdabA");
    var result = new Future();
    var user = Meteor.user();
    var shippingUser;
   
    if(!user.profile.shippingUser || !user.profile.shippingUser.id) {
       //get the shipping user
       shipping.createChild(function (err, child) {
          if(err) return result.throw(err);

          console.log('created child', child)
         //get the api keys for the user
        shipping.getChildApiKeys(child.id, function (err, keys) {
          if(err) return result.throw(err);

          console.log('getting child keys', keys);
          //get production key
          var productionKey = _.find(keys, function (key) {
            return key.mode == 'production';
          })

          //get test key
          var testKey = _.find(keys, function (key) {
            return key.mode == 'test';
          });

          var shippingProfile = {
            "profile.shippingUser" : {
              id : child.id,
              email : child.email,
              testApiKey : testKey.key,
              productionApiKey : productionKey.key
            } 
          };

          //add the shipping api info to the user object
          Meteor.users.update({_id : Meteor.userId},{$set : shippingProfile});

          //get the shipping rates
          get_shipping_rates(user, testKey.key);
        });
      });
    } else if(user.profile.shippingUser.id) {
      get_shipping_rates(user);
    }


    function get_shipping_rates (user, apiKey) {
      var shipping = new SHIPPING(user, apiKey);

      shipping.getShippingRates(transactionId, parcelObj, shippingFromObj, function (err, rates) {
        if(err) {
          console.error(err);
          return result.throw(err);
        }

        result.return(rates);
      });
    }

    return result.wait();
  }
});


// Meteor.methods({
//   sendPayment:function(vendorId) {
//     var vendor = Vendors.findOne({_id:vendorId}).stripe;
//     var stripe = Meteor.npmRequire("stripe")("sk_live_rNjG94LGyl52oDz7ZMTCSilq");
//
//     stripe.transfers.create({
//       amount: 500, // amount in cents
//       currency: "usd",
//       recipient: vendor.recipient,
//       bank_account: vendor.bank_account,
//       statement_descriptor: "Test Sales"
//     }, function(err, transfer) {
//       console.log(transfer)
//     });
//
//   }
// });
