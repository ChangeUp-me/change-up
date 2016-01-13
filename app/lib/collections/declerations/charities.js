Charities = new orion.collection('charities', {
	singularName : 'charity',
	pluralName : 'charities',
	link : {
		title : 'Charities'
	},
	tabular : {
		columns : [{
			data : 'name',
			title : 'Name'
		},{
			data : 'category',
			title : 'Category'
		}]
	}
})
