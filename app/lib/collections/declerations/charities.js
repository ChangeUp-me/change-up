Charities = new orion.collection('charities', {
	singularName : 'Charity',
	pluralName : 'Charities',
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
