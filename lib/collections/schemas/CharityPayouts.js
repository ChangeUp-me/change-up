CharityPayouts.attachSchema(new SimpleSchema({
  charityId : {
    type : String,
    optional : false
  },
  charityName : {
    type : String,
    optional : true
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
  },
  paidToCharity : {
    type : Boolean,
    defaultValue : false,
    optional : true
  }
}));
