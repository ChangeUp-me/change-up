changeup_animations = (function () {
	return{
		addToCart : addToCart
	};

	function addToCart (element, item) {
		var target = $('.toggle-cart');
		var $element = $(element);
		var color = $element.css('backgroundColor');
		var $svgRectangle = createRectangle(element);

		placeRectangle($svgRectangle, element);

		animate();

		function animate () {
			$element.css({
				"background-color" : 'transparent',
				color : 'black'
			})

			TweenMax.to($svgRectangle, 1, {
				width : $element.height(),
				height : $element.height(),
				borderRadius : 180
			})
		}

		function placeRectangle (rec, element) {
			var outerwidth = $(element).outerWidth();

			$(rec).css({
				top : 0,
				right : 0,
				position : 'absolute',
				display : 'inline-block',
				"margin-top" : parseInt($element.css('marginTop')) * 2 + 'px'
			})

			//wrap the button
			var wrap = $('<div />', {
				class : 'clearfix'
			})
			.css({
				position : 'relative',
				width : outerwidth,
				display : "inline-block",
			})

			$element.wrap(wrap).css({width : outerwidth})
			$element.parent().append(rec);
		}

		function createRectangle (element) {
			var $element = $(element);

			console.log('color', color);

			return $('<div />').css({
				width : $element.outerWidth(),
				height : $element.outerHeight(),
				"background-color" : color
			})
		}
	};
})();