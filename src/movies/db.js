// db.js

const mongoose = require('mongoose');

// schema

const Movies = new mongoose.Schema({
	title: String,
	director: String,
	year: Number
});

mongoose.model('Movies', Movies);

mongoose.connect('mongodb://localhost/movies');