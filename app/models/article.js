module.exports=function(mongoose){
  var Schema = mongoose.Schema;
  var articleSchema = new Schema(
    { name:  {type:String},
      type:  {type:String},
      sentimentType: {type:String},
      sentimentValue: {type:Number},
      relevance: {type:Number},
      dateInt: {type:Number}
    });
  mongoose.model('Article',articleSchema);
}
