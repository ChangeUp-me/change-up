(function () {
  BankAccounts.attachSchema(schema())

	function schema () {
		return new SimpleSchema({
			stripeAccountId : {
				type : String
			},
			vendorId : {
				type : String,
				optional : true
			},
			charityId : {
				type : String,
				optional : true
			},		
			entityType : { //vendor,charity
				type : String
			}
		});
	}
})();
