(function() {
  var theSchema = shipmentSchema();
  Shipments.attachSchema(new SimpleSchema(theSchema));

  function shipmentSchema() {
    return {
      transactionId : {
        type : String
      },
      vendorId: {
        type: String
      },
      shipmentId: {
        type: String
      },
      postageLabelId: {
        type: String
      },
      fromAddress: {
        type: Object,
        blackbox: true
      },
      toAddress: {
        type: Object,
        blackbox: true
      },
      carrier: {
        type: String
      },
      service: {
        type: String
      },
      trackingCode: {
        type: String
      },
      deliveryDays: {
        type: String
      },
      labelImage : {
        type : String
      },
      pdfUrl : {
        type : String,
        optional : true
      }
    };
  }
})();