var http = require('http');
var data = "";
module.exports=function(date1,date2,cb){
	http.get('http://hearstcars.api.mashery.com/v1/api/content/index/0/1000/desc/json/'+date1+'/'+date2+'?api_key=tbpfres3crg38aw9m2v3bnvq',function(res){
		res.on('data',function(chunk){
			data += chunk.toString();
		});
		res.on('end',function(){
			console.log(JSON.parse(data));
			cb(JSON.parse(data));
		});
	});
}