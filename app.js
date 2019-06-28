var express = require('express');
var app = express();
var dotenv = require('dotenv');
var db = require('./config/database.js');
var path = require('path');
dotenv.config();

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/views/'));
var models = require('./migrations/models');

app.get('/',(req,res)=>{
    res.redirect('/trangchu');
});

var thanhvien = require('./routes/thanhvien-router');
app.use('/', thanhvien);


app.get('/sync', function (req, res) {
    models.sequelize.sync().then(function () {
        res.send('database created.');
    });
});

var PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});