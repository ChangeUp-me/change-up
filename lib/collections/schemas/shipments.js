(function () {
	var theSchema = shipmentSchema();

	Shipments.attachSchema(new SimpleSchema(theSchema));

	function shipmentSchema () {
		return {
			userId : {
				type : String,
			},
			shipment_id : {
				type : String
			},
			order_id : {
				type : String
			}
		};
	}
})();