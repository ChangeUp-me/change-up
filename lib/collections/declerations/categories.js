Categories = new orion.collection('categories',{
  singularName: 'category',  // The name of one of these items
  pluralName: 'categories', // The name of more than one of these items
  title: 'Categories', // The title in the index of the collection
  link: {
    title: 'Categories',
  },
  tabular: {
    columns: [
      {data: 'name', title: 'Category'},
    ]
  }
});
