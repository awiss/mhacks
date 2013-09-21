module.exports=function(mongoose) {
  var Article =
  mongoose.model('Article',
    { name: String,
      make:String,
      model:String,
      makeSentimentType:String,
      makeSentimentValue:String
      modelSentimentType:String,
      modelSentimentValue:String
    });

};
