
FeaturedProducts = new orion.collection('featuredProducts',{
  singularName: 'featuredProduct',  // The name of one of these items
  pluralName: 'featuredProducts', // The name of more than one of these items
  title: 'Featured Products', // The title in the index of the collection
  link: {

    title: 'Featured Products',
    index:3
  },

  tabular: {
    columns: [
      {data: 'date', title: 'Date' },
      {data: 'current', title: 'Current Day'}
    ]
  }
});
