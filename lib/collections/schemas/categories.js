(function () {
  var CategoriesSchema = new SimpleSchema({
		name : {
			type : String,
		},
		subcategories : {
			type : [String],
			optional : true
		}
	})
	Categories.attachSchema(CategoriesSchema);
})();
