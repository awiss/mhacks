module.exports=function(mongoose){
  var Schema = mongoose.Schema;
  var entitySchema = new Schema(
    { name:  {type:String},
      type:  {type:String},
      sentimentType: {type:String},
      sentimentValue: {type:Number},
      relevance: {type:Number},
      dateInt: {type:Number},
      title: {type:String},
      body: {type:String}
    });
  mongoose.model('Entity',entitySchema);
}
