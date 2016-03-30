CharityPayouts = new orion.collection('charityPayouts', {
	singularName : 'Charity Payout',
	pluralName : 'Charity Payouts',
	link : {
		title : 'Charity Payouts'
	},
	tabular : {
		columns : [{
			data : 'charityName',
			title : 'Charity Name'
		},{
			data : 'weekEnd',
			title : 'Payout Period'
		}]
	}
})
