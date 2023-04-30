//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");  
const _ = require('lodash');  
const mongoose = require('mongoose');


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));  
app.use(express.static("public"));

mongoose.connect('mongodb+srv://atiqur88:test123@cluster0.n6wsmz4.mongodb.net/dailyjournaldb').catch(error => {
  console.log("not connected" + error );
})
.then ( () => {
  console.log("connected to mongodb");
})

// mongoose.connect('mongodb://127.0.0.1:27017/dailyJournaldb').catch(error => {
//   {
//     console.log('not connected ' + error);
//   }
// }).then (() => {
//   console.log('connected to mongodb');
// });


const schema = new mongoose.Schema({ // schema
  title : String , 
  description : String 
})

const journal = mongoose.model('journal' , schema); // model

app.get('/' ,function(req,res){
  journal.find()
  .then (result => {
      res.render('home' , { posts : result } );
  })
});

app.get('/about' ,function(req,res){
  res.render('about');
} );
app.get('/contact' , function(req,res){
  res.render('contact');
});
app.get("/compose" , function(req,res){
  res.render('compose', {title : 'Compose' });
});

app.post('/delete' , function(req, res){
  journal.deleteOne({title : req.body.deletepost}).catch ( (error )=> {
    if (error){
      console.log('error occured'+error );
    }
  })
  res.redirect('/') ; 
})
app.post("/compose" , function(req,res){
  const reqTitle = _.upperFirst(_.lowerCase(req.body.titlebody));
  if (reqTitle){
    const newJournal = new journal({
      title : reqTitle , 
      description : req.body.postbody
    });
    newJournal.save(); 
    res.redirect('/');
  }
  else{
    res.redirect('/');
  }
});

app.get('/post/:postName' , function(req,res){
  let requestTitle = _.upperFirst(_.lowerCase(req.params.postName));
  journal.findOne({title : requestTitle})
  .then (result => {
    if (result){
      res.render('post' , {title : result.title , content : result.description });
    }
    else {
      res.send('<h1>No journals found</h1>');
    }
  })
});





 





const port = process.env.PORT || 3000 ; 
app.listen(port , function(){
    console.log('app is listening on port ' + port );
});
