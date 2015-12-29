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

CharitiesSchema = new SimpleSchema({
		name : {
			type : String
		},
		image : {
			type : Object,
			blackbox: true,
			optional : true
		},
		description : {
			type : String,
			defaultValue : ''
		},
		about : {
			type : String,
			defaultValue : ''
		},
		category : {
			type : String,
			defaultValue : ''
		},
		websiteLink : {
			type : String,
			optional : true,
		}
	})
	
	Charities.attachSchema(CharitiesSchema);