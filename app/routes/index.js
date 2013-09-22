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
 start = new Date(start.getFullYear(),start.getMonth()+2,start.getDate());
}
var months = {};
function addtoMonthData(name,time,value){
	for(var i=0;i<monthTimes.length;i++){
		if(time<monthTimes[i] && i>0){
			months[name][i-1].push(value);
			break;
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

		res.render('index', {title:'Sentimental',make : false, data:modelData, monthData: null});

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
			if(docs[i].name=='Toyota') console.log(docs[i]);
			if(docs[i].relevance>0.5){

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
			for(var i=2; i<monthTimes.length;i++){
				if(months[x][i].length>0){
					total = 0;
					for(var j=0;j<months[x][i].length;j++){
						total+=months[x][i][j];
					}
					total = total/months[x][i].length;
					monthsFinal[x].push({x:monthTimes[i],y:total});
				}
			}
		}
		res.render('index', {title:'Sentimental',make:true, data:makeData, monthData:monthsFinal});
	});
};
function remotizeATags(html){
	var regexp = /(<a[^>]*?\shref=['"])([\s\S]+?)['"]/g;
	return html.replace(regexp,function(str,p1,p2){
		if(p2.indexOf('/')==0){
			return str.replace(p2,"http://www.caranddriver.com"+p2);
		} else {
			return str;
		}
	});
}
exports.body = function(req,res){
	var id = req.params.id;
	var make = req.params.make;
	if(make=='true'){
		Entity.findById(id,{body:1},function(err,doc){
			if(typeof doc != 'undefined' && doc!=null){
				res.write(remotizeATags(doc.body));
				res.end();
			}
		});
	} else {
		Article.findById(id,{body:1},function(err,doc){
			if(typeof doc != 'undefined' && doc!=null){
				res.write(remotizeATags(doc.body));
				res.end();
			}
		});
	}
}
