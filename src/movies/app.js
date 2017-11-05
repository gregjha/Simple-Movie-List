// app.js

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const publicPath = path.resolve(__dirname, 'public');
const session = require('express-session');
app.use(express.static(publicPath));

//const db = require('./db.js')
require('./db');
const mongoose = require('mongoose');
const Movies = mongoose.model('Movies');

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

const sessionOptions = {
	secret: 'secret signing',
	saveUninitialized: false,
	resave: false
};
app.use(session(sessionOptions));

app.get('/css/base.css', function(req, res) {
	res.sendFile('/css/base.css');
});

app.get('/movies', function(req, res) {
	Movies.find(function(err, data){
		let director;
		const movies = data.filter(function(mov){
			if (req.query.director === "" || req.query.director === undefined){
				return mov;
			}
			else{
				director = "Showing only movies directed by: " + req.query.director;
				return mov.director === req.query.director;
			}		
		});
		res.render('movies',{'title':"Movies", 'movies':movies, 'director':director, 'header':"Let's Watch Some Movies!"});
	});	
});

app.get('/movies/add', function(req,res) {
	res.render('addmovies', {'title':'Add Movies', 'header':'Add a Movie'});
});

app.get('/mymovies', function(req,res) {
	const addedMovies = req.session.addedMovies;
	res.render('mymovies', {'title':'My Movies', 'header':'Added Movies','added':addedMovies});
});

app.post('/movies/add', function(req,res){
	const newMovie = {title: req.body.title, director: req.body.director, year: req.body.year};
	if (!req.session.hasOwnProperty('addedMovies')){
		req.session.addedMovies = [];
		req.session.addedMovies.push(newMovie);
	}
	else {
		req.session.addedMovies.push(newMovie);
	}
	new Movies({
		title: newMovie.title,
		director: newMovie.director,
		year: newMovie.year
	}).save(function(){
		res.redirect('/movies');
	});	
});

app.listen(3000);