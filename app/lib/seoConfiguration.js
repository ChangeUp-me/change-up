//Seo Standard Configuration
Meteor.startup(function() {
  if(Meteor.isClient) {
    return SEO.config({
      title: 'Featured | Change Up',
      meta: {
        'description': 'Change Up | Exclusive Products, Inclusive Community.', //155 characters.
        'robots': 'all',
        'distribution': 'global',
        'author': 'Change Up'
      },
      og: {
      	'type': 'website',
      	'site_name': 'Change Up',
        'description': 'Change Up | Exclusive Products, Inclusive Community.', //155 characters.
        'title': 'Change Up',
        'image': 'http://www.changeup.com/icons/favicon.ico'
      }
    });
  }
});

//***************************************//
//*********** Static page Seo ***********//
//***************************************//

//** About Page **//
staticSEO(
	routeName = 'about',
	title = 'About Us | Change Up',
);

//** News **//
staticSEO(
	routeName = 'news',
	title = 'News | Change Up',
);

//** Charities **//
staticSEO(
	routeName = 'charities',
	title = 'Charities | Change Up',
);

//** Vendors List **//
staticSEO(
	routeName = 'vendorsList',
	title = 'Vendors | Change Up',
);

// ** Checkout ** //
staticSEO(
  routeName = 'checkout',
  title = 'Checkout | Change Up'
);

// ** Transfers ** //
staticSEO(
  routeName = 'transfers',
  title = 'Transfers | Change Up'
)
