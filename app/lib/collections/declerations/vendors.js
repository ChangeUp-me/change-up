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