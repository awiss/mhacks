var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
require('./models/entity')(mongoose);
require('./models/article')(mongoose);
var Entity = mongoose.model("Entity");
var Article = mongoose.model("Article");
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('2094dd01fd7cbceb7e1bb916840e40e81f25d16f');

pull(9,1,9,2);

function pull(year,month,nextYear,nextMonth){
  if(year<13 || month<10){
    console.log(year);
    console.log(month);
    console.log(nextYear);
    console.log(nextMonth);
    var a = (Math.floor(year/10)).toString();
    var b = (year%10).toString();
    var c = (Math.floor(month/10)).toString();
    var d = (month%10).toString();
    var na = (Math.floor(nextYear/10)).toString();
    var nb = (nextYear%10).toString();
    var nc = (Math.floor(nextMonth/10)).toString();
    var nd = (nextMonth%10).toString();
    console.log(""+a+b+c+d);
    console.log(""+na+nb+nc+nd);

    require("./populate")('20'+a+b+c+d+'00','20'+na+nb+nc+nd+'00',processArticles);
    month++;
    if(month==13){
      year++;
      month=1;
    }
    nextMonth++;
    if(nextMonth==13){
      nextYear++;
      nextMonth=1;
    }
    setTimeout(function(){
      pull(year,month,nextYear,nextMonth);
    },1000);
  }
}



function processArticles(hearst_response){
// if the make matches a keyword, returns a sentiment object associated with that make
  function check_make(keyword) {
    for (var i=0;i<hearst_response.content.make.length;i++) {
      if (keyword.text.toLowerCase().indexOf(hearst_response.content.make[i].name.toLowerCase())>-1) {
        keyword.text = hearst_response.content.make[i].name;
        return keyword;
      }
    }
    return null;
  }

  // if the model matches a keyword, returns a sentiment object associated with that model
  function check_model(keyword) {
    for (var i=0;i<hearst_response.content.model.length;i++) {
      if (keyword.text.toLowerCase().indexOf(hearst_response.content.model[i].name.toLowerCase())>-1) {
        keyword.text=hearst_response.content.model[i].name;
        return keyword;
      } else if (hearst_response.content.model[i].name.toLowerCase().indexOf(keyword.text.toLowerCase())>-1){
        return keyword;
      }
    }
    return null;
  }

  var articles = hearst_response.content.articles;
  for(var i=0;i<articles.length;i++){
    var article = articles[i];
    var text = article.bodyHTML.body.replace(/<.*?>/g,"");
    (function(theArticle){
      alchemy.keywords(text, {sentiment:1}, function(err, response) {
        if (!err){
        // See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
          var entities = response.keywords;
          for (var j=0; j<entities.length;j++) {
            var entity = entities[j];
            var type = "make";
            var match = check_make(entity);
            if(match==null){
              match = check_model(entity);
              type="model";
            }
            if (match) {
              var score;
              if(match.sentiment.type=="neutral"){
                score=0.0;
              } else {
                score = match.sentiment.score;
              }
              var name = match.text;
              name = name.charAt(0).toUpperCase() + name.slice(1);
              Article.create({type:type, sentimentType:match.sentiment.type, dateInt:new Date(theArticle.publishDate).getTime(),
                relevance:match.relevance,sentimentValue:score,name:name,title:theArticle.fullTitle,body:theArticle.bodyHTML.body}
                function(error,affected){
                  console.log(affected);

              });
            } 
          }
        }
      });
    })(article);
  }
}
