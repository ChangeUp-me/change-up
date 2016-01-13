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

var ProductsSchema = new SimpleSchema({
  vendorId: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
    optional: true
  },
  price: {
    type: String
  },
  currency: {
    type: String,
    defaultValue: 'usd'
  },
  reviews: {
    type: [review_schema()],
    optional: true
  },
  quantity: {
    type: Number,
    defaultValue: 0
  },
  sizes: {
    type: [String],
    optional: true,
    defaultValue: []
  },
  details: {
    type: String,
    optional: true
  },
  image : orion.attribute('image', {
    optional: true,
    label: 'Image'
  }),
  shippingPrice: {
    type: String,
    defaultValue: '0.0'
  },
  //countriesAllowedToShip : []
  percentToCharity: {
    type: Number,
    defaultValue: 5
  },
  deleted: {
    type: Boolean,
    defaultValue: false
  },
  likeCount: {
    type: Number,
    defaultValue: 0
  },
  featuredPosition : {
    type : Number,
    optional : true
  },
  featuredUntil : {
    type : Date,
    optional : true
  }
})

Products.attachSchema(ProductsSchema);

function review_schema() {
  return new SimpleSchema({
    id : {
      type : String,
      autoValue : function () {
        if(this.isUpdate) {
          return Random.id();
        }
        this.unset();
      }
    },
    rating: {
      type: Number
    },
    title: {
      type: String
    },
    name: {
      type: String
    },
    userId: {
      type: String
    },
    timestamp: {
      type: Date,
      autoValue : function () {
        if(this.isInsert || this.isUpdate) {
          return new Date();
        } else {
          this.unset();
        }
      }
    },
    comment: {
      type: String
    }
  })
}