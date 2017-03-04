const express = require('express'),
    app = express(),
    db = require('./db.js');

app.get("/test", function(req,res){
    res.send("TEST")
})

app.listen(8888, function(){
    console.log("WE GOT A SERVER")
});