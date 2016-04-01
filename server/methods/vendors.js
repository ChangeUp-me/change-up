Meteor.methods({
  vendorPayout:function(token_id) {
    if (Meteor.users.findOne({_id:Meteor.userId()}).profile.vendorId) {
      if(token_id != null || token_id != "" || token_id != undefined) {
        var profile = Meteor.users.findOne({_id:Meteor.userId()});
        var vendor = Vendors.findOne({_id:profile.profile.vendorId});
        var stripe = Meteor.npmRequire("stripe")("sk_live_rNjG94LGyl52oDz7ZMTCSilq");

        Meteor.users.update({_id:Meteor.userId()}, {$set: {'profile.stripe.bank_account':String(token_id)}});
        Vendors.update({_id : vendor._id}, {$set: {'stripe.bank_account':String(token_id)}});

        stripe.recipients.create({
          name: vendor.storeName,
          type: "corporation",
          bank_account: token_id,
          email: profile.emails[0].address,
        }, function(err, recipient) {
          var Fiber = Meteor.npmRequire('fibers');
          Fiber(function() {
            Meteor.users.update({_id:profile._id}, {$set: {'profile.stripe.recipient':recipient.id}});
            Vendors.update({_id : vendor._id}, {$set: {'stripe.recipient':recipient.id}});
          }).run();
        });
      }
    }
  }
});


Meteor.methods({
  sendPayment:function(vendorId) {
    var vendor = Vendors.findOne({_id:vendorId}).stripe;
    var stripe = Meteor.npmRequire("stripe")("sk_live_rNjG94LGyl52oDz7ZMTCSilq");

    stripe.transfers.create({
      amount: 553, // amount in cents
      currency: "usd",
      recipient: vendor.recipient,
      bank_account: vendor.bank_account,
      statement_descriptor: "Test Sales"
    }, function(err, transfer) {
      console.log(transfer)
    });

  }
});
