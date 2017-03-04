"use strict"
require('dotenv').config();
const express = require('express'),
    app = express(),
    db = require('./databases/db.js'),
    storage = require('./databases/storage.js'),
    vision = require('./vision.js'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    upload = multer({
        storage: multer.memoryStorage()
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/test", function (req, res) {
    res.send("TEST")
});

app.post("/caption", function (req, res) {
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
    console.log(req.file);
    storage.uploadPhoto(req.file);
    res.send("Recieved Photo");
})
app.post("/addPhoto", function (req, res) {
    var url = req.body.imgURL,
        point = [
            1, 2
        ],
        tags = "SAM DARNOLD";
    db
        .Photo
        .create({url: url, lat: point[0], lng: point[1], tags: tags, caption: "TEST CAPTION"})
        .then((response) => {
            res.send(response)
        })
        .catch((err) => {
            res.send(err);
        });
})

app.listen(process.env.port || 8888, function () {
    console.log("WE GOT A SERVER")
});

process.on('uncaughtException', (err) => {
    console.log(err);
});