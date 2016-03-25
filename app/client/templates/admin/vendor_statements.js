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
            var fees = transaction.processingFees;
            var charityDonation = transaction.charityDonation;
            //var vendorShipping = transaction.vendorShipping;
            var vendorProfit = transaction.vendorProfit;
            var sales = Number(fees)+Number(charityDonation)+Number(vendorProfit);
            return new Spacebars.SafeString("$"+(sales || 0));
          }
        }, {
          key: '_id',
          label: 'Payment Processing Fee',
          fn: function (value) {
            var fees = VendorPayouts.findOne({'_id':value}).processingFees;
            return new Spacebars.SafeString("$"+fees);
          }
        }, {
          key: 'charityDonation',
          label: 'Charity Donation',
          fn: function (value) {
            return new Spacebars.SafeString("$"+value);
          }
        }, /*{
          key: 'vendorShipping',
          label: 'Shipping Fee',
          fn: function (value) {
            return new Spacebars.SafeString("$"+value);
          }
        },*/ {
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
