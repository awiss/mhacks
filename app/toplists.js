var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
require('./models/article')(mongoose);
var Article = mongoose.model("Article");
require('./models/rank')(mongoose);
var Rank = mongoose.model("Rank");


Article.find({},{type:1,name:1,sentimentValue:1},function(err,docs){
	var model = {};
	var modelNums = {};
	var make = {};
	var makeNums = {};
	for(var i=0;i<docs.length;i++){
		var doc = docs[i];
		if(doc.type=="model"){
			if(typeof model[doc.name]=="undefined"){
				model[doc.name]=doc.sentimentValue;
				modelNums[doc.name]=1;
			} else {
				model[doc.name]+=doc.sentimentValue;
				modelNums[doc.name]++;
			}
		} else {
			if(typeof make[doc.name]=="undefined"){
				make[doc.name]=doc.sentimentValue;
				makeNums[doc.name]=1;
			} else {
				make[doc.name]+=doc.sentimentValue;
				makeNums[doc.name]++;
			}
		}
	}
	modelArr =[];
	for(m in model){
		var avg = model[m]/modelNums[m];
		modelArr.push({name:m,sentAvg:avg});
	}
	modelArr.sort(function(a,b){
		return b.sentAvg-a.sentAvg;
	});
	for(var i=0;i<modelArr.length;i++){
		Rank.create({name:modelArr[i].name,type:'model',rank:i+1,total:modelArr.length,sentAvg:modelArr[i].sentAvg},function(err){
			console.log('done');
		});
	}
	makeArr = [];
	for(m in make){
		var avg = make[m]/makeNums[m];
		makeArr.push({name:m,sentAvg:avg});
	}
	makeArr.sort(function(a,b){
		return b.sentAvg-a.sentAvg;
	});
	for(var i=0;i<makeArr.length;i++){
		Rank.create({name:makeArr[i].name,type:'make',rank:i+1,total:makeArr.length,sentAvg:makeArr[i].sentAvg},function(err){
			console.log('done');
		});
	}
});