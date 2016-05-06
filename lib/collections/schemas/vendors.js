if(Meteor.isServer) {
  Vendors.attachSchema(new SimpleSchema(vendorSchema()));
} else if(Meteor.isClient) {
  var schema = vendorSchema();
  schema = _.omit(schema, ['orders', 'charities', 'unseenOrders', 'unseenOrders.$', 'unseenOrders.$.transactionId']);

  schema.userId = orion.attribute('hasOne', {
    type : String,
    unique : true
  }, {
    collection : Meteor.users,
    titleField : ['profile.name', 'emails.address', 'roles'],
    publicationName : Random.id(),
    filter : function (userId) {
      return {'roles' : {$in : ['vendor']}};
    }
  })

  Vendors.attachSchema(new SimpleSchema(schema));
}

function vendorSchema () {
  return {
    userId: {
      type: String,
      unique: true
    },
    image : orion.attribute('image', {
      optional: true,
      label: 'Image'
    }),
    websiteUrl: {
      type: String,
      optional: true
    },
    storeName: {
      type: String,
    },
    storeDescription: {
      type: String,
      defaultValue: ''
    },
    about: {
      type: String,
      optional: true
    },
    orders: {
      type: [orders_schema()],
      optional: true
    },
    charities: {
      type: [String],
      optional: true,
    },
    shipsFrom : {
      type : ships_from(),
      optional : true
    },
    unseenOrders: {
      type: Array,
      optional: true,
    },
    shippingPrice: {
      type: Number,
      optional: true
    },
    "stripe.bank_account": {
      type: String,
      optional: true
    },
    "stripe.recipient": {
      type: String,
      optional: true
    },
    "unseenOrders.$": {
      type: Object,
      optional: true,
      blackbox: true
    },
    "unseenOrders.$.transactionId": {
      type: String,
      optional: true
    }
  }
}

function ships_from () {
  return new SimpleSchema({
    street : {
      type : String
    },
    city : {
      type : String
    },
    zipcode : {
      type : String
    },
    country : {
      type : String
    },
    state : {
      type : String
    }
  })
}

function orders_schema() {
  return new SimpleSchema({
    transactionId: {
      type: String
    },
    processed: {
      type: Boolean,
      defaultValue: false
    },
    fufilled: {
      type: Boolean,
      defaultValue: false
    }
  })
}
