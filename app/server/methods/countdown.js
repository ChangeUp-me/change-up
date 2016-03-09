Meteor.methods({
  whatTimeIsIt : function () {
    var now = new Date(); // get today's date
    var end = ((now.getMonth()+1)+"/"+now.getDay()+"/"+now.getFullYear()+" 23:59:59 EST")
    end = new Date(end);
    return {'serverNow': today, "serverEnd": end}
  }
});


Meteor.startup(function () {
  // Function to update Featured products
  function updateFeaturedProducts() {
    var now = new Date(); // get today's date
    var end = ((now.getUTCMonth()+1)+"/"+now.getUTCDate()+"/"+now.getUTCFullYear()+" 23:59:59 EST");
    end = new Date(end);

    try {
      var varLast = FeaturedProducts.findOne({'current': true}).date;

      if (end > varLast){
        console.log("Updating Featured Products");
        FeaturedProducts.update({}, {$set: {'current': false}}, {multi: true}); //update all items in collection to not be current day
        var newProducts = Products.find().fetch(); //get length of all products in store
        if (newProducts.length < 6){ //if all products in store less than 6 set no of items to select to no of items in store
          var noOfProducts = newProducts.length;
        } else { // if more than 6, set no of products to 6
          var noOfProducts = 6;
        }
        var arrayOfObjects = []; // holder for the place in the array of products well select from
        for (var i = 0; i < noOfProducts; i){
          var randomlySelectedObj = Math.floor((Math.random()*newProducts.length)); //randomly select a number between 0 and no of products in shop
          var inArray = _.contains(arrayOfObjects, (newProducts[randomlySelectedObj]._id)); // boolean to see if id already selected
          if (inArray === false){ // if id not in array
            arrayOfObjects.push(newProducts[randomlySelectedObj]._id); //insert into array
            i++; // increment
          }
        }
        FeaturedProducts.insert({'date': end, 'products': arrayOfObjects, 'current': true});
      }
    } catch (e) {
      console.log("First Time Featured Products");
      var newProducts = Products.find().fetch(); //get length of all products in store
      if (newProducts.length < 6){ //if all products in store less than 6 set no of items to select to no of items in store
        var noOfProducts = newProducts.length;
      } else { // if more than 6, set no of products to 6
        var noOfProducts = 6;
      }
      var arrayOfObjects = []; // holder for the place in the array of products well select from
      for (var i = 0; i < noOfProducts; i){
        var randomlySelectedObj = Math.floor((Math.random()*newProducts.length)); //randomly select a number between 0 and no of products in shop
        var inArray = _.contains(arrayOfObjects, (newProducts[randomlySelectedObj]._id)); // boolean to see if id already selected
        if (inArray === false){ // if id not in array
          arrayOfObjects.push(newProducts[randomlySelectedObj]._id); //insert into array
          i++; // increment
        }
      }
      FeaturedProducts.insert({'date': end, 'products': arrayOfObjects, 'current': true});
    }
  }
  // Check to update featured products on a hourly basis
  // Meteor.setInterval(updateFeaturedProducts, 3600000);
  Meteor.setInterval(updateFeaturedProducts, 3600);
});
