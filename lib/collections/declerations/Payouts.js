VendorPayouts = new orion.collection('vendorPayouts', {
	singularName : 'Vendor Payout',
	pluralName : 'Vendor Payouts',
	link : {
		title : 'Vendor Payouts'
	},
	tabular : {
		columns : [{
			data : 'vendorName',
			title : 'Vendor Name'
		},{
			data : 'weekEnd',
			title : 'Payout Period'
		}]
	}
})
