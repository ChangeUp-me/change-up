
ContactUs = new orion.collection('contactUs',{
  singularName: 'message',  // The name of one of these items
  pluralName: 'messages', // The name of more than one of these items
  title: 'Contact Us', // The title in the index of the collection
  link: {

    title: 'Contact Us',
    index:3
  },

  tabular: {
    columns: [
      {data: 'date', title: 'Date' },
      {data: 'name', title: 'Name'},
      {data: 'email', title: 'Email'}
    ]
  }
});
