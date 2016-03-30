//********* SEO for static page **************//
staticSEO = function(routeName, title){
try{
SeoCollection.update(
    {
        route_name: routeName
    },
    {
        $set: {
            route_name: routeName,
            title: title,

        }
    },
    {
        upsert: true
    }
);
}catch(e){

}
}
