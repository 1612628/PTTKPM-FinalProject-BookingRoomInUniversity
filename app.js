var express = require('express');
var app = express();
var dotenv = require('dotenv');
var db = require('./config/database.js');
var path = require('path');
dotenv.config();

app.use(express.json())
app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/views/'));
var models = require('./models');

app.get('/', (req, res) => {
    res.redirect('/trangchu');
});

var thanhvien = require('./routes/thanhvien-router');
app.use('/', thanhvien);

app.get('/sync', function (req, res) {
    models.sequelize.sync().then(function () {
        res.send('database created.');
    });
});

// admin
app.use('/dist', express.static('dist'))
const admin = require('./routes/quantri-router')
const adminApi = require('./routes/quantri-api')
app.use('/admin/api', adminApi)
app.use('/admin', admin)
app.use('/admin/*', admin)

var PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});