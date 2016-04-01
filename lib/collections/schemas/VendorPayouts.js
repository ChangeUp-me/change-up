VendorPayouts.attachSchema(new SimpleSchema({
  vendorId : {
    type : String,
    optional : false
  },
  /*vendorName : {
    type : String,
    optional : true
  },*/
  vendorProfit : {
    type : String,
    optional : false
  },
  /*vendorShipping : {
    type : String,
    optional : true
  },*/
  processingFees : {
    type : String,
    optional : false
  },
  stripeFee : {
    type : String,
    optional : false
  },
  changeUpFee : {
    type : String,
    optional : false
  },
  charityDonation : {
    type : String,
    optional : false
  },
  weekStart : {
    type : Date,
    optional : false
  },
  weekEnd : {
    type : Date,
    optional : false
  }
}))
