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
	});
};

exports.make = function(req,res){
	var makeName = req.params.make;
	makeName = makeName.replace('_', ' ');
	Article.find({ name: makeName, type: 'make'}, function(err, docs){
		res.send(docs);
	});
};