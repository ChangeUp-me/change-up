accessRequests = new orion.collection('accessRequests', {
	singularName : 'accessRequest',
	pluralName : 'accessRequests',
	link : {
		title : 'Access Requests'
	},
	tabular : {
		columns : [{
			data : 'requestType',
			title : 'request type'
		}, {
			data : 'confirm',
			title : 'confirmed'
		}]
	}
});

