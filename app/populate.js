var http = require('http');
module.exports=function(date1,date2,cb){
	var data = "";
	console.log(date1);
	console.log(date2);
	http.get('http://hearstcars.api.mashery.com/v1/api/content/index/0/1000/desc/json/'+date1+'/'+date2+'?api_key=tbpfres3crg38aw9m2v3bnvq',function(res){
		res.on('data',function(chunk){
			data += chunk.toString();
		});
		res.on('end',function(){
			cb(JSON.parse(data));
		});
	});
}