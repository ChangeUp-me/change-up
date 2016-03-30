describe('Meteor.methods', function () {
	"use strict";

	beforeEach(function () {
		MeteorStubs.install();
		mock(global, 'Products');
	})

	afterEach(function () {
		MeteorStubs.uninstall();
	})

	describe('insertProduct', function () {
		it('should insert a new product from a vendor', function () {
			
		})
	})
})