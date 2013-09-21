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
	Article.find({ name: modelName, type: 'model'},{sentimentValue:1,relevance:1,dateInt:1,title:1}).sort({dateInt:'asc'}).exec(function(err, docs){
		var values = [];
		var dates = [];
		var ids = [];
		var titles = [];
		for(var i = 0; i < docs.length; i++) {
			console.log(docs[i].sentimentValue);
			console.log(docs[i].relevance);
			values.push(docs[i].sentimentValue * docs[i].relevance);
			dates.push(docs[i].dateInt);
			ids.push(docs[i]._id);
			titles.push(docs[i].title);
		}
		console.log(titles);
		res.render('index', {modelName: modelName, values: values, dates: dates, ids:ids,titles:titles});
	});
};

exports.make = function(req,res){
	var makeName = req.params.make;
	makeName = makeName.replace('_', ' ');
	Article.find({ name: makeName, type: 'make'},{sentimentValue:1,relevance:1,dateInt:1,title:1}).sort({dateInt:'asc'}).exec(function(err, docs){
		var values = [];
		var ids = [];
		var titles = [];
		var dates = [];
		for(var i = 0; i < docs.length; i++) {
			values.push(docs[i].sentimentValue * docs[i].relevance);
			dates.push(docs[i].dateInt);
			ids.push(docs[i]._id);
			titles.push(docs[i].title);
		}
		console.log(titles);
		res.render('index', {modelName: makeName, values: values, dates: dates, ids:ids,titles:titles});
	});
};

exports.body = function(req,res){
	var id = req.params.id;
	Article.findById(id,{body:1},function(err,doc){
		res.write(doc.body);
		res.end();
	});
}
