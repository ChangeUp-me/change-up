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
  integrateShippingApiKeys : function (apiKeys) {
    var user = Meteor.user();
    var result = new Future();

    check(apiKeys, {
      testApiKey : String,
      productionApiKey : String
    });

    var shipping = new SHIPPING(user, apiKeys.productionApiKey);

    shipping.getAccountApiKeys(function (err, keys) {
      if(err) return result.throw(err);

      //get production api key
      var productionKey = _.find(keys, function (key) {
        return key.mode == 'production';
      });

      //get test api key
      var testKey = _.find(keys, function (key) {
        return key.mode == 'test';
      });

      var shippingProfile = {
        "profile.shippingUser.testApiKey" : testKey.key,
        "profile.shippingUser.productionApiKey" : productionKey.key
      };

      console.log('setting', shippingProfile)

      try{
        //add the shipping api info to the user object
        Meteor.users.update({_id : Meteor.userId()},{$set : shippingProfile}); 
      } catch (e) {
        return result.throw(e);
      }

      return result.return('success');
    });
  },
  createShippingAccount : function (accountObj) {
    var result = new Future();
    var nonEmptyString = Match.Where(function (x) {
      check(x, String);
      return x.length > 0;
    });

    var name = Meteor.user().profile.name;

    check(accountObj, {
      name : nonEmptyString,
      email : nonEmptyString,
      password : nonEmptyString,
      password_confirmation : nonEmptyString,
      phone_number : nonEmptyString
    });

    var shipping = new SHIPPING(Meteor.user());

    //create a brand new account
    shipping.createAccount(accountObj, function (err, account) {
      if(err) return result.throw(err);

      var shippingProfile = {
        "profile.shippingUser" : {
          id : account.id,
          email : account.email
        } 
      };

      try{
        Meteor.users.update({_id : Meteor.userId()},{$set : shippingProfile}); 
      } catch(e) {
        return result.throw(e);
      }

      return result.return('success');     
    });

    return result.wait();   
  },
  getShippingRates : function (transactionId, parcelObj, shippingFromObj) {
    var shipping = new SHIPPING(Meteor.user(), "pR6aTPWO32kIqYdpKSdabA");
    var result = new Future();
    var user = Meteor.user();
    var shippingUser = user.profile.shippingUser;

    console.log(shipping.client)
   
    if(!shippingUser || !shippingUser.id) {
      return result.throw(new Meteor.Error('you have to integrate an easypost account first'));
    } else if(user.profile.shippingUser.id) {
      var shipping = new SHIPPING(user, shippingUser.testApiKey);

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
