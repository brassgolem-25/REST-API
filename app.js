
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const ARTICLE = mongoose.model("Article",articleSchema);

/////////////// REQUEST TARGETING ALL ARTICLES //////////
app.route('/articles')
.get(function(req,res){
  ARTICLE.find(function(err,result){
    if(!err){
      res.send(result);
    }else {
      res.send(err);
    }
  })
})

.post(function(req,res){
  const newArticle = new ARTICLE({
    title: req.body.title,
    content: req.body.content
  })
  newArticle.save(function(err){
    if(!err){
      res.send("Status Code : 200");
    }else {
      res.send(err);
    }
  })
})

.delete(function(req,res){
  ARTICLE.deleteMany(function(err){
    if(!err){
      res.send('All documents successfully deleted');
    }else {
      res.send(err);
    }
  })
});

/////////////// REQUEST TARGETING ALL ARTICLES //////////
app.route('/articles/:articleTitle')

.get(function(req,res){
  ARTICLE.findOne({title: req.params.articleTitle},function(err,result){
    if(err || !result){
      res.send("There's been an error");
    }else {
      res.send(result);
    }
  })
})

.put(function(req,res){
  ARTICLE.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
  function(err){
    if(!err){
      res.send('Successfully Updated');
    }else {
      res.send(err);
    }
  })
})

.patch(function(req,res){
  ARTICLE.updateOne(
    {title:req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send('Successfully Updated!');
      }else {
        res.send(err);
      }
    }
  )
})

.delete(function(req,res){
  ARTICLE.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send('Successfully deleted');
      }else {
        res.send(err);
      }
    }
  )
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
