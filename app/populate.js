var http = require('http');
module.exports=function(date1,date2,cb){
	var data = "";
	console.log(date1);
	console.log(date2);
	http.get('http://www.caranddriver.com/api/content/index/0/1000/desc/json/28436befb13d191e06175f049251a0d86b19e3e6/'+date1+'/'+date2,function(res){
		res.on('data',function(chunk){
			data += chunk.toString();
		});
		res.on('end',function(){
			cb(JSON.parse(data));
		});
	});
}