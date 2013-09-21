var mongoose = require('mongoose');
var Article = mongoose.model("Article");

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.model = function(req,res){
	var modelName = req.params.model;
	modelName = modelName.replace('_',' ');
	Article.find({ name: modelName, type: 'model'}, function(err, docs){
		res.send(docs);
		var values = [];
		var dates = [];
		for(var i = 0; i < docs.length; i++) {
			values.push(docs[i].sentimentValue * docs[i].relevance);
			dates.push(docs[i].dateInt);
		}
		res.render('index', {modelName: modelName, values: values, dates: dates});
	});
};

exports.make = function(req,res){
	var makeName = req.params.make;
	makeName = makeName.replace('_', ' ');
	Article.find({ name: makeName, type: 'make'}).sort({dateInt:'asc'}).exec(function(err, docs){
		var values = [];
		var dates = [];
		for(var i = 0; i < docs.length; i++) {
			values.push(docs[i].sentimentValue * docs[i].relevance);
			dates.push(docs[i].dateInt);
		}
		res.render('index', {modelName: makeName, values: values, dates: dates});
	});
};