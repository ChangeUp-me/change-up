/*****************************************************************************/
/* Reviews: Event Handlers */
/*****************************************************************************/
Template.Reviews.events({
	'submit form#review' : function (event) {
		event.preventDefault();

		var form = event.target;
		var productId = this._id;

		var review = {
			rating : function () {
				return $('#review-stars').children('.selected').length;
			}(),
			title : form.reviewTitle.value,
			comment : form.comment.value
		}

		if(review.rating < 1) {
			return sAlert.error('please leave a rating');
		}

		Meteor.call('addProductReview', productId, review, function (err, data) {
			if(err){
				return sAlert.error(err);
			} else if (data === "please log in to post a review"){
				return sAlert.error(data);
			} else if (data === "review updated"){
				sAlert.success(data);
			} else {
				sAlert.success('review posted');
			}

			Router.go('/item/'+productId);
		});
	},
	'click #review-stars li' : function (event) {
		var star = $(event.target);
		var stars = star.prevAll();
		var nextStars = star.nextAll();

		//select the clicked star and
		//ever star before it
		star.addClass('selected');
		stars.addClass('selected');

		//unselect every star after the clicked star
		nextStars.removeClass('selected');
	},
	'click #write-toggle': function() {
		$("#review-panel").slideToggle();
	}
});

/*****************************************************************************/
/* Reviews: Helpers */
/*****************************************************************************/
Template.Reviews.helpers({
	reviewStars : function  () {
		return [1,2,3,4,5];
	},
	getMyReview : function () {
		var reviews = this.reviews || [];
		var userId = Meteor.userId();
		var userReview = {};

		if(!userId) return userReview;

		for(var i =0; i < reviews.length; i++) {
			if(reviews[i].userId == userId) {
				userReview = reviews[i];	
				break;
			}
		}

		return userReview;
	}
});

/*****************************************************************************/
/* Reviews: Lifecycle Hooks */
/*****************************************************************************/
Template.Reviews.onCreated(function () {
});

Template.Reviews.onRendered(function () {
	$("#review-panel").hide();
});

Template.Reviews.onDestroyed(function () {
});
