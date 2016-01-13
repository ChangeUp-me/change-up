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

var VendorSchema = new SimpleSchema({
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
});

Vendors.attachSchema(VendorSchema);

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