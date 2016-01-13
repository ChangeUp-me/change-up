  Products = new orion.collection('products', {
    singularName: 'product',
    pluralName: 'Products',
    link: {
      title: 'products'
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