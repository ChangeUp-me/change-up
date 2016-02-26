CharityPayouts.attachSchema(new SimpleSchema({
  charityId : {
    type : String,
    optional : false
  },
  charityName : {
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
}));
