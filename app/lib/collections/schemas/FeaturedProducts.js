FeaturedProducts.attachSchema(new SimpleSchema({
	date: {
		type: Date,
		label : "Date",
		optional: false,
	},
	products: {
		type: [String],
		label : "Featured Products",
		optional: false
	},
	current: {
		type: Boolean,
		label: "Current Day",
		optional: false
	}
}));
