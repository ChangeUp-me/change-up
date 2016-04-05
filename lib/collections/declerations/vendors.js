Vendors = new orion.collection('vendors', {
  singularName: 'Vendor',
  pluralName: 'Vendors',
  link: {
    title: 'Vendors'
  },
  tabular: {
    columns: [{
      data: 'storeName',
      title: 'Store Name'
    }, {
      data: '_id',
      title: 'Store ID'
    }, {
      data: 'userId',
      title: 'Associated Account'
    }]
  }
});
