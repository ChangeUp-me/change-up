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

        // Randomly select 6 items. Holding Off On This For Now
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

  //       // 6 Random Items From 6 Random Vendors
  //       console.log("Updating Featured Products");
  //       FeaturedProducts.update({}, {$set: {'current': false}}, {multi: true}); //update all items in collection to not be current day
  //       FeaturedProducts.remove({});
  //       var possibleVendorList = Vendors.find().fetch(); //get all vendors in store
  //       possibleVendorList = shuffle(possibleVendorList);
  //       var arrayOfObjects = [];
  //       var i = 0;
  //
  //       while (arrayOfObjects.length < 6 && i < possibleVendorList.length) {
  //         try {
  //           var newProducts = Products.find({"vendorId": possibleVendorList[i]._id}).fetch();
  //           var randomlySelectedObj = Math.floor((Math.random()*newProducts.length));
  //           var newProduct = newProducts[randomlySelectedObj]._id;
  //           arrayOfObjects.push(newProduct);
  //         } catch (e) {
  //
  //         }
  //         i++;
  //       }
  //
  //       FeaturedProducts.insert({'date': end, 'products': arrayOfObjects, 'current': true});
  //     }
  //   } catch (e) {
  //     console.log("First Time Featured Products");
  //     // var newProducts = Products.find().fetch(); //get length of all products in store
  //     // if (newProducts.length < 6){ //if all products in store less than 6 set no of items to select to no of items in store
  //     //   var noOfProducts = newProducts.length;
  //     // } else { // if more than 6, set no of products to 6
  //     //   var noOfProducts = 6;
  //     // }
  //     // var arrayOfObjects = []; // holder for the place in the array of products well select from
  //     // for (var i = 0; i < noOfProducts; i){
  //     //   var randomlySelectedObj = Math.floor((Math.random()*newProducts.length)); //randomly select a number between 0 and no of products in shop
  //     //   var inArray = _.contains(arrayOfObjects, (newProducts[randomlySelectedObj]._id)); // boolean to see if id already selected
  //     //   if (inArray === false){ // if id not in array
  //     //     arrayOfObjects.push(newProducts[randomlySelectedObj]._id); //insert into array
  //     //     i++; // increment
  //     //   }
  //     // }
  //     var possibleVendorList = Vendors.find().fetch(); //get length of all vendors in store
  //     possibleVendorList = shuffle(possibleVendorList);
  //     var arrayOfObjects = [];
  //     var i = 0;
  //
  //     while (arrayOfObjects.length < 6 && i < possibleVendorList.length) {
  //       try {
  //         var newProducts = Products.find({"vendorId": possibleVendorList[i]._id}).fetch();
  //         var randomlySelectedObj = Math.floor((Math.random()*newProducts.length));
  //         var newProduct = newProducts[randomlySelectedObj]._id;
  //         arrayOfObjects.push(newProduct);
  //       } catch (e) {
  //
  //       }
  //       i++;
  //     }
  //     FeaturedProducts.insert({'date': end, 'products': arrayOfObjects, 'current': true});
  //   }
  // }
  // Check to update featured products on a hourly basis
  Meteor.setInterval(updateFeaturedProducts, 3600000);
  // Meteor.setInterval(updateFeaturedProducts, 3600);
});

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
