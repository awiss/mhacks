var article = require("./models/article");
var hearst_response = "";

// if the make matches a keyword, returns a sentiment object associated with that make
check_make = function(keyword) {
  for (make in hearst_response.content.make) {
    if (keyword.text.toLowerCase === make.name.toLowerCase) {
      return make;
    }
  }
  return null;
}

// if the model matches a keyword, returns a sentiment object associated with that model
check_model = function (keyword) {
  for (model in hearst_response.content.submodel) {
    if (keyword.text.toLowerCase === model.name.toLowerCase) {
      return model;
    }
  }
  return null;
}


var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('2094dd01fd7cbceb7e1bb916840e40e81f25d16f');
var text = "";
alchemy.keywords(text, {}, function(err, response) {
  if (err) throw err;

  var sentiments = [];
  // See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
  var keywords = response.keywords;
  for (keyword in keywords) {
    var make = check_make(keyword);
    var model = check_model(keyword);
    if (make && (!model)) {
      article.save({name:keyword.text, make:make.name, model:null, makeSentimentType:keyword.sentiment.type,
        makeSentimentValue:keyword.sentiment.score, modelSentimentType:null,
        makeSentimentValue:null, function(error){console.log("error writing to mongoose")})
    }
      if ((!make) && model) {
      article.save({name:keyword.text, make:null, model:model.name, makeSentimentType:null,
        makeSentimentValue:null, modelSentimentType:keyword.sentiment.type,
        makeSentimentValue:keyword.sentiment.score, function(error){console.log("error writing to mongoose")})
    }
      if (make && model) {
      article.save({name:keyword.text, make:make.name, model:model.name, makeSentimentType:keyword.sentiment.type,
        makeSentimentValue:keyword.sentiment.score, modelSentimentType:keyword.sentiment.type,
        makeSentimentValue:keyword.sentiment.score, function(error){console.log("error writing to mongoose")})
    }
    else {
        article.save({name:keyword.text, make:null, model:null, makeSentimentType:null,
        makeSentimentValue:null, modelSentimentType:null,
        makeSentimentValue:null, function(error){console.log("error writing to mongoose")})
    }
  }

  // Do something with data
});