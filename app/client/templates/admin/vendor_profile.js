(function () {
  /*****************************************************************************/
  /* VendorProfile: Event Handlers */
  /*****************************************************************************/
  Template.VendorProfile.events({
    "click [data-click-addcharity]" : function (event) {
      event.preventDefault();

      if(this._id) return Router.go('addCharity');

      var form = document.getElementById("storeForm");

      //save what we have now
      var store = {
        storeName : form.storeName.value,
        storeDescription : form.storeDescription.value,
        websiteUrl : form.websiteUrl.value
      };

      Session.set('vendor:create', store);

      Router.go('addCharity');
    },
    "submit #storeForm" : function (event) {
      event.preventDefault();
      var form = event.target;
      var image = Session.get('upload:image');

      var store =  {
        storeName : form.storeName.value,
        storeDescription : form.storeDescription.value,
        websiteUrl : form.websiteUrl.value,
        charities : function () {
          var charities = [];
          _.forEach($('#selectlist').children(), function (val, indx){
            charities.push($(val).attr('data-id'));
          })
          return charities;
        }()
      }

      if(image) {
        store.image = image;
      }

      Meteor.call('updateVendor', store, function (err) {
        if(err){
          console.error(err);
          return sAlert.error(err);
        }

        Session.set('selectedCharities', null); 

        sAlert.success('vendor updated!')
      })
    },

    /**
    * Remove a charity from selected charities
    */
    "click .select-list-item > img.remove-item" : function (event) {
      //vendor has already been created
      if(Meteor.user().profile.vendorId) {
        //remove the charity from the vendor
        Meteor.call('removeVendorCharity', this.id, function (err) {
          if(err) {
            return sAlert.error(err);
          }
        })
      }
      //vendor being created for the first time 
      else {
        removeCharityFromSession(this.id);
      } 
    }
  });
  /*****************************************************************************/
  /* VendorProfile: Helpers */
  /*****************************************************************************/

  Template.VendorProfile.helpers({
    selectedCharities : function () {
      var vendor = Vendors.findOne({userId : Meteor.userId()});
      var charities = Charities.find().fetch();
      var joinedCharities = [];

      //if a vendor has been created before
      if(vendor !== undefined && charities) {
        //join the charities names to their id's
        var joinedCharities = joinCharityInfo(charities, vendor);

        Session.set('selectedCharities', joinedCharities);
      }

      return Session.get('selectedCharities');
    }
  });
  /*****************************************************************************/
  /* VendorProfile: Lifecycle Hooks */
  /*****************************************************************************/
  Template.VendorProfile.onCreated(function() {});
  Template.VendorProfile.onRendered(function() {
    $('#imageUpload').changeUpUpload({
      targetImage : '#targetImage',
      progressBar : '#uploadProgress'
    })
  });
  Template.VendorProfile.onDestroyed(function() {


  });


  /**
  * Joins a Charities name to the proper id
  *
  * @note - this is done seperately as mongodb is 
  * non relational and doesn't have join queries.
  * 
  * @param {Array} Charities - an array of charities [{id : 'idone', name :'charityname' }]
  * @param {Object} Vendor - a vendors object {charities : ['idone']}
  */
  function joinCharityInfo (charities, vendor) {
    var joinedCharities = [];

    //search through each charity returned from the db
    charities.forEach(function (charity, indx) {
      //look through each of the vendors charities
      vendor.charities.forEach(function (charityId, indx) {
        //if we find a charity that matches
        //add the charities name to the joined charity array
        //we will use this later on to join it to hte users current session
        if(charityId == charity._id) {
          joinedCharities.push({id : charityId, name : charity.name})
        }
      })
    })

    return joinedCharities;
  }

  /**
  * Remove a charity from a session, based on it's id
  *
  * @param {String} id - 'charityid'
  */
  function removeCharityFromSession (id) {
      var arr = Session.get('selectedCharities') || [];

      var index = arr.findIndex(function (charity, index) {
        return charity.id == id;
      });

      arr.splice(index,1);

      Session.set('selectedCharities', arr);
    }

})();



