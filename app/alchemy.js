var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
require('./models/article')(mongoose);
var Article = mongoose.model("Article");
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('2094dd01fd7cbceb7e1bb916840e40e81f25d16f');
require("./populate")('20130820','20130920',function(hearst_response){



// if the make matches a keyword, returns a sentiment object associated with that make
  function check_make(keyword) {
    console.log('here');
    for (var i=0;i<hearst_response.content.make.length;i++) {
      if (keyword.text.toLowerCase() === hearst_response.content.make[i].name.toLowerCase()) {
        return keyword;
      }
    }
    return null;
  }

  // if the model matches a keyword, returns a sentiment object associated with that model
  function check_model(keyword) {
    for (var i=0;i<hearst_response.content.model.length;i++) {
      if (keyword.text.toLowerCase() === hearst_response.content.model[i].name.toLowerCase()) {
        return keyword;
      }
    }
    return null;
  }

  var articles = hearst_response.content.articles;
  for(var i=0;i<articles.length;i++){
    var article = articles[i];
    var text = article.bodyHTML.body.replace(/<.*?>/g,"");
    alchemy.keywords(text, {sentiment:1}, function(err, response) {
      if (err) throw err;
      // See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
      var keywords = response.keywords;
      for (var j=0; j<keywords.length;j++) {
        var keyword = keywords[j];
        var type = "make";
        var match = check_make(keyword);
        if(match==null){
          match = check_model(keyword);
          type="model";
        }
        if (match) {
          console.log(match);
          Article.create({name:match.text, type:type, sentimentType:match.sentiment.type
            , sentimentValue:match.sentiment.score,relevance:match.relevance,dateInt:new Date(article.publishDate).getTime()}, 
            function(error){
              console.log("Saved");
          });
        } 
      }
    });
  }
  console.log('done');
});