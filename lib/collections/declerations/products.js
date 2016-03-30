  Products = new orion.collection('products', {
    singularName: 'Product',
    pluralName: 'Products',
    link: {
      title: 'Products'
    },
    tabular: {
      columns: [{
        data: 'name',
        title: 'Name'
      }, {
        data: '_id',
        title: 'productId'
      }, {
        data: 'price',
        title: 'Price'
      }, {
        data : 'featuredPosition',
        title : 'Featured Position'
      }]
    }
  });