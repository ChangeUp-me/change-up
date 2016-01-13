/*****************************************************************************/
/* Reviews: Event Handlers */
/*****************************************************************************/
Template.Reviews.events({
	'submit form#review' : function (event) {
		event.preventDefault();

		if(!Meteor.user())
			return sAlert.info('please login to leave a review');

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

		Meteor.call('addProductReview', productId, review, function (err) {
			if(err)
				return sAlert.error(err);

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
	}
});

/*****************************************************************************/
/* Reviews: Helpers */
/*****************************************************************************/
Template.Reviews.helpers({
	reviewStars : function  () {
		return [1,2,3,4,5];
	}
});

/*****************************************************************************/
/* Reviews: Lifecycle Hooks */
/*****************************************************************************/
Template.Reviews.onCreated(function () {
});

Template.Reviews.onRendered(function () {
});

Template.Reviews.onDestroyed(function () {
});
