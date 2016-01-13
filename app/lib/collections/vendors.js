Vendors = new orion.collection('vendors', {
  singularName: 'vendor',
  pluralName: 'Vendors',
  link: {
    title: 'vendors'
  },
  tabular: {
    columns: [{
      data: 'storeName',
      title: 'Store Name'
    }]
  }
});

if(Meteor.isServer) {
  Vendors.attachSchema(new SimpleSchema(vendorSchema()));
} else if(Meteor.isClient) {
  var schema = vendorSchema();
  schema = _.omit(schema, ['orders', 'charities', 'unseenOrders', 'unseenOrders.$', 'unseenOrders.$.transactionId']);
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
    unseenOrders: {
      type: Array,
      optional: true,
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