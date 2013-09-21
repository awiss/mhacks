var mongoose = require('mongoose');
var Article = mongoose.model('Article');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.model = function(req,res){

};

exports.make = function(req,res){

};