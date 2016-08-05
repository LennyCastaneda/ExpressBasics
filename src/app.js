//adding use strict statment to throw error if made
'use strict';

//adding expressjs using node require statement
//using express also as a variable name to access all properties and methods of express module
var express = require('express'),

//requiring the posts.json file just like any other node modul in app.js file
	  posts = require('./mock/posts.json');

var postsLists = Object.keys(posts).map(function(value) {
							         return posts[value]})

//creating a var and assigning express to it
var app = express();

//to use static files app.use(express.static);
//app.use uses middleware the logic of how to handle a request before it arrives at the route
//also add prefix for the file served out of the public dir
app.use('/static', express.static(__dirname + '/public'))

//telling express how to render templates
//app.set definse different setting within our application
app.set('view engine', 'jade');

//using app.set to define the views params and takes a folder path were express will look for our templates 
//using trick to envoke the dir name variable (__dirname). this is important since we are starting the server from a differnt directory
app.set('views', __dirname + '/templates');

//exstending and altering the app var by assigning different routes and settings
//var app is central part of our application

//creating a route on the app var
/*creating a route for the root of our server that sends the user to if they do not
specify a certain route or folder*/
//using the respond method to send a string to the client by using the annomous method
//request and response can also be called req and res
//res.send method you can also send html
//app.get('/') is adding an index route
app.get('/', function(req, res){

	// creating var for landing page route
	// grabbing path of the req object
	// the path is the url of the path
	var path = req.path;

	// assigning the path to the local objecct in the response
	// is the same as res.render('index', {path: path});
	res.locals.path = path;

	//adding index template to our route
	res.render('index');
});

//adding another route using the app.get method and adding an annonomous callback function
//adding a param to blog (ex. blog/:id) everything after ':' will turn into the param
//adding '?' to tell express the param is optional
app.get('/blog/:title?', function(req, res){ 

	//adding logic to find a corresponding post
	var title = req.params.title;

	//adding logic to display something to users when visiting /blog
	if (title === undefined) {

		//adding so engin understands the page is underconstruction and is a status 503 and not a status 200 
		res.status(503);
		res.render('blog', {posts: postsLists})
	} else {

		//using params to look up our posts object
		//if title does not exist using || {} to define an empty object
		var post = posts[title] || {};

		//sending data to the client when request to the blog route is made
		res.render('post', { post: post});
	}
});


// creating an API endpoint so anyone can grab the post data
app.get('/posts', function(req, res) {
	if (req.query.raw) {
		res.json(posts);
	} else {

	// creating a callback
	// res.json is the exact same as respond.send method...the differenc is the json method can coerce null and undefinesd values into valid json 
	// handy if sending data to the browser with express
		res.json(postsLists);
	}
})


//setting up development server using the listen method
//3000 is the port number
//listen mothod can take a callback funct as a second param 
app.listen(3000, function() {

	//adding a message to inform what is happening
	//be explicit "frontend" just in case you may have other servers running
	console.log("The frontend server is running on port 3000!");
});
