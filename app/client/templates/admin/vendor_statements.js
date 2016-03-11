Template.VendorStatements.helpers({
  vendorStatements : function () {
    var vendorId = Meteor.user().profile.vendorId;
    return VendorPayouts.find({'vendorId':vendorId}).fetch();
  },
  vendorStatementsSettings: function () {
    return {
      collection: VendorPayouts,
      rowsPerPage: 10,
      showFilter: true,
      fields: [
        {
          key: 'weekStart',
          label: 'Week Of',
          sortOrder: 0,
          sortDirection: 'ascending',
          fn: function (value) {
            return new Spacebars.SafeString(value.toLocaleDateString());
          }
        }, {
          key: '_id',
          label: 'Week\'s Sales',
          fn: function (value) {
            var transaction = VendorPayouts.findOne({'_id':value});
            var stripeFee = transaction.stripeFee;
            var changeUpFee = transaction.changeUpFee;
            var charityDonation = transaction.charityDonation;
            var vendorShipping = transaction.vendorShipping;
            var vendorProfit = transaction.vendorProfit;
            var sales = Number(stripeFee)+Number(changeUpFee)+Number(charityDonation)+Number(vendorShipping)+Number(vendorProfit);
            return new Spacebars.SafeString("$"+sales);
          }
        }, {
          key: '_id',
          label: 'Payment Processing Fee',
          fn: function (value) {
            var stripeFee = VendorPayouts.findOne({'_id':value}).stripeFee;
            var changeUpFee = VendorPayouts.findOne({'_id':value}).changeUpFee;
            var paymentFee = Number(stripeFee)+Number(changeUpFee);
            return new Spacebars.SafeString("$"+paymentFee);
          }
        }, {
          key: 'charityDonation',
          label: 'Charity Donation',
          fn: function (value) {
            return new Spacebars.SafeString("$"+value);
          }
        }, {
          key: 'vendorShipping',
          label: 'Shipping Fee',
          fn: function (value) {
            return new Spacebars.SafeString("$"+value);
          }
        }, {
          key: 'vendorProfit',
          label: 'Vendor Payout',
          fn: function (value) {
            return new Spacebars.SafeString("$"+value);
          }
        }
      ]
    };
  }
});
