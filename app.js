var express = require('express');
var app = express();
var dotenv = require('dotenv');
var db = require('./config/database.js');
var path = require('path');
dotenv.config();

app.use(express.json());
app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/views/'));
var models = require('./models');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/' + 'thanh-vien-dang-nhap.html'));
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
const adminApi = require('./routes/quantri-api')
app.use('/admin/api', adminApi)

const { App } = require('./src/app')
const { Admin } = require('./src/admin')
const Database = require('./src/repos')

const database = new Database.SequelizeDatabase(models)
let myApp = new App('room booking', app, database)

const adminComponent = new Admin()
myApp.addComponent(adminComponent)


var PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});