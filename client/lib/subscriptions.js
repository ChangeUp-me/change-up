(function () {
	Meteor.subscribe('users');
	Meteor.subscribe('allCharities');
	Meteor.subscribe('vendors');
	Meteor.subscribe('products');
	Meteor.subscribe('allLikes');
	Meteor.subscribe('userTransactions');
	Meteor.subscribe('vendorTransactions');
})();