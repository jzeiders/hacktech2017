"use strict"
require('dotenv').config();
const express = require('express'),
    app = express(),
    db = require('./databases/db.js'),
    handlers = require("./handlers"),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    upload = multer({
        storage: multer.memoryStorage()
    }),
    vision = require('./vision.js'),
    path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/test", function (req, res) {
    res.send("TEST")
});

app.post("/caption", function (req, res) {
    console.log("Recieved Request");
    var url = req.body.imgURL;
    vision
        .getCaptionData(url)
        .then((response) => {
            res.send(response);
        })
        .catch((rej) => {
            console.log(rej);
        });
});

app.post("/photo", upload.single("photo"), function (req, res) {
    handlers.photo(req).then((success)=>{
        res.send(success);
    }).catch((err) => {
        console.log("Failed", err);
        res.send(err);
    });
});

app.get("/allPhotos", function(req,res){
    handlers.getAllPhotos().then((photos)=>{
        console.log("Found Photos");
        res.send(photos);
    }).catch((err)=>{
        console.log("FUCK")
        res.send(err);
    });
});

app.post("/photoNearby", function(req,res){
    console.log(req.body);
    handlers.getAllNearby(req.body.lat,req.body.lng).then((photos)=>{
        res.send(photos);
    }).catch((err)=>{
        res.send(err);
    });
});

app.post("/emotions",function(req,res){
    vision.getEmotions(req.body.url).then((data) => {
        console.log("WTF");
        console.log(data);
        res.send(data.toString());
    }).catch((err) => {
        console.log("Error")
        res.end(err);
    });
});

app.get("/id", function(req,res){
    var id = req.query.id;
    handlers.getData(id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err);
    });
});

app.get("/user", function(req,res){
    var userid = req.query.id;
    handlers.getUserData(userid).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err);
    });
});
app.use(express.static(path.resolve(__dirname, 'website', 'public')));


app.get("/", function(req,res){
    res.sendFile(path.resolve(__dirname,'website/public/index.html'));
});

app.use(function(req, res){
   res.sendStatus(404);
});

app.listen(process.env.port || 8888, function () {
    console.log("WE GOT A SERVER")
});

// process.on('uncaughtException', (err) => {
//     console.log(err);
// });