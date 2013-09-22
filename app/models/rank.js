module.exports=function(mongoose){
  var Schema = mongoose.Schema;
  var rankSchema = new Schema(
    { name:  {type:String},
      type:  {type:String},
      rank: {type:Number},
      total: {type:Number},
      sentAvg: {type:Number}
    });
  mongoose.model('Rank',rankSchema);
}
