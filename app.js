var express = require('express');
var app = express();
var dotenv = require('dotenv');
dotenv.config();
require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+0000');
    // e.g., UTC offset. Use any offset that you would like.
});

var models = require('./models');
var db = require('./config/database.js');

app.use(express.static(__dirname+'/public/'));


app.get('/sync',function(req,res){
    models.sequelize.sync().then(function(){
        res.send(   'database created.');
    });
});



app.get('/laytatcathietbi',function(req,res){
    models.thiet_bi.findAll().then(dstb=>{
        res.send(dstb);
    })
});

var PORT = process.env.PORT;
app.listen(PORT, () =>{
    console.log(`Server is running at ${PORT}`);
});