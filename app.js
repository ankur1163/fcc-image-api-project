var express = require('express');

var path = require('path');
var app = express();
var multer  = require('multer');
var request = require('request');
var mongodb = require('mongodb');
var moment = require('moment');

var MongoClient = mongodb.MongoClient;

var mongo_url =  process.env.MONGOLAB_URI || "mongodb://ankur1163:lightbulb1@ds013946.mlab.com:13946/ank1163";

var Bing = require('node-bing-api')
            ({
              accKey: "7e792dc10eed41b9a079f6d1a30a97bd"

            });
var upload = multer({ dest: 'uploads/' });
var t;

app.use(express.static(path.join(__dirname, 'views')));

app.listen(process.env.PORT || 5000);


app.get("/api/imagesearch/:id",function(req,response){
      var f = req.params.id;
      var t = parseInt(req.query.offset);
      var tj = req.query.offset;
      console.log("value of offset ",t);
      var g;
      var k;
      var time = moment().format('MMMM Do YYYY, h:mm:ss a');
      var  l;
      var tarray =[];
  //inserting search query in database
  MongoClient.connect(mongo_url, function (err, db) {
      // do inserts and quering here ...
      if(err) {
        throw err
      }
      var data = {
          recentSearch: f,
          when:time

      }
      var insertedId = db.collection('latestsearches').insert(data); // this is sync version of insertion


  });

  //insertion ends

      // start

      if(t===1){

        Bing.images(f, {top:10, skip: 0}, function(error, res, body){
          console.log("started");
          //g = JSON.stringify(body);
          for(var i =0;i<10;i++)
          {
            tarray.push({
            url: body.value[i].contentUrl,
            snippet: body.value[i].name,
            thumbnail: body.value[i].thumbnailUrl,
            context:body.value[i].hostPageDisplayUrl
                        });

          }
           var mn = JSON.stringify(tarray)
          response.send(tarray);
          console.log(tarray);
        })
      }

        else if (t===2){
          Bing.images(f, {top:20, skip: 10}, function(error, res, body){
            console.log("started");
            console.log("this is first body    \n",body);
            g = JSON.stringify(body);
            console.log("this is end of the body \n y\n e\n s \n \n \n \n \n \n \n \n")
            for(var i =0;i<20;i++)
            {
              tarray.push({
              url: body.value[i].contentUrl,
              snippet: body.value[i].name,
              thumbnail: body.value[i].thumbnailUrl,
              context:body.value[i].hostPageDisplayUrl
          });

            }

           if (tarray.length > 10)
           {

           tarray = tarray.slice(-10);
         }

               console.log("this is final array ",tarray);
            response.json(tarray);
          })

        }

        else if(t===3){
          Bing.images(f, {top:30, skip: 20}, function(error, res, body){
            console.log("started");
            g = JSON.stringify(body);
            for(var i =0;i<30;i++)
            {
              tarray.push({
              url: body.value[i].contentUrl,
              snippet: body.value[i].name,
              thumbnail: body.value[i].thumbnailUrl,
              context:body.value[i].hostPageDisplayUrl
          });

            }

                       if (tarray.length > 10)
                       {
                       tarray = tarray.slice(-10);
                     }
            response.json(tarray);
          })

        }
        else{
          response.send("No results to display. Please put offset=1,2 or 3. Api doesnt understand your offset value")
        }

var fjson = JSON.stringify(tarray);

       console.log(fjson);


      })



      //end




app.get("/",function(req,res){
  res.render("index.html");
})
//this starts

app.get('/api/latest/imagesearch/', function(req, res){
    MongoClient.connect(mongo_url, function (err, db) {
        // do inserts and quering here ...
        if(err) {
          throw err
        }
      //var latsearches =db.collection('latestsearches').find( );
      var documents = SpeCollection.AsQueryable();
      console.log("latest searches are ",latsearches);



    });
});
