var mongoose = require('mongoose');
var Entity = mongoose.model("Entity");
var Article = mongoose.model("Article");
/*
 * GET home page.
 */

var monthTimes = [];
var now = new Date().getTime();
var start = new Date(2009,0,1);
while(start<now){
 monthTimes.push(start.getTime());
 start = new Date(start.getFullYear(),start.getMonth()+1,start.getDate());
}
console.log(monthTimes);
var months = {};

function addtoMonthData(name,time,value){
	for(var i=0;i<monthTimes.length;i++){
		if(time<monthTimes[i] && i>0){
			months[name][i-1].push(value);
		}
	}
}

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
	
	Article.find({ name:{$in:modelNames} , type: 'model'},{name:1,sentimentValue:1,relevance:1,dateInt:1,title:1}).sort({dateInt:'asc'}).exec(function(err, docs){
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
	months = {};
	var makeName = req.params.make;
	makeName = makeName.replace('_', ' ');
	makeNames = makeName.split('&');
	var makeData = {};
	var monthsFinal = {};
	for(var i=0; i<makeNames.length;i++){
		makeData[makeNames[i]]=[];
		months[makeNames[i]]=[];
		for(x in monthTimes){
			months[makeNames[i]][x] = [];
		}
		monthsFinal[makeNames[i]]=[];
	}

	Entity.find({ name: { $in: makeNames }, type: 'make'},{name:1,sentimentValue:1,relevance:1,dateInt:1,title:1}).sort({dateInt:'asc'}).exec(function(err, docs){
		for(var i = 0; i < docs.length; i++) {
			if(docs[i].relevance>0.7){
				var yvalue = docs[i].sentimentValue * docs[i].relevance;
				addtoMonthData(docs[i].name,docs[i].dateInt,yvalue);
				makeData[docs[i].name].push({ 
					y: yvalue,
					x: docs[i].dateInt,
					mongoId: docs[i]._id,
					articleTitle: docs[i].title
				});
			}
		}
		function average(arr){
			total=0;
			for(x in arr){
				total+=arr[x];
			}
			return total/arr.length;
		}
		for (x in months){
			console.log(months[x][4]);
			for(var i=0; i<monthTimes.length;i++){
				if(months[x][i].length>3){
					total = 0;
					for(var j=0;j<months[x][i].length;j++){
						total+=months[x][i][j];
					}
					total = total/months[x][i].length;
					monthsFinal[x].push({x:monthTimes[i],y:total});
				}
			}
		}
		res.render('index', {modelName: makeName, data:makeData, monthData:monthsFinal});
	});
};

exports.body = function(req,res){
	var id = req.params.id;
	Entity.findById(id,{body:1},function(err,doc){
		res.write(doc.body);
		res.end();
	});
}
