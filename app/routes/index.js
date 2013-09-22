var mongoose = require('mongoose');
var Entity = mongoose.model("Entity");
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
	modelNames = modelName.split('&');
	var modelData = {};
	for(var i=0; i<modelNames.length;i++){
		modelData[modelNames[i]]=[];
	}
	var first = new Date().getTime();
	Article.find({ name:{$in:modelNames} , type: 'model'},{name:1,sentimentValue:1,relevance:1,dateInt:1,title:1}).sort({dateInt:'asc'}).exec(function(err, docs){
		console.log(new Date().getTime()-first);
		for(var i = 0; i < docs.length; i++) {
			modelData[docs[i].name].push({ 
				y: docs[i].sentimentValue * docs[i].relevance,
				x: docs[i].dateInt,
				mongoId: docs[i]._id,
				articleTitle: docs[i].title
			});
		}
		res.render('index', {modelName: modelName, data:modelData});
	});
};

exports.make = function(req,res){
	var makeName = req.params.make;
	makeName = makeName.replace('_', ' ');
	console.log(makeName);
	makeNames = makeName.split('&');
	console.log(makeNames);
	var makeData = {};
	for(var i=0; i<makeNames.length;i++){
		console.log(makeNames[i]);
		makeData[makeNames[i]]=[];
	}

	Entity.find({ name: { $in: makeNames }, type: 'make'},{name:1,sentimentValue:1,relevance:1,dateInt:1,title:1}).sort({dateInt:'asc'}).exec(function(err, docs){
		for(var i = 0; i < docs.length; i++) {
			makeData[docs[i].name].push({ 
				y: docs[i].sentimentValue * docs[i].relevance*docs[i].relevance*docs[i].relevance,
				x: docs[i].dateInt,
				mongoId: docs[i]._id,
				articleTitle: docs[i].title
			});
		}
		res.render('index', {modelName: makeName, data:makeData});
	});
};

exports.body = function(req,res){
	var id = req.params.id;
	Entity.findById(id,{body:1},function(err,doc){
		res.write(doc.body);
		res.end();
	});
}
