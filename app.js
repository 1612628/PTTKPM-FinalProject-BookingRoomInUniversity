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
app.get('/dist/admin/*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    console.log(req.url)
    res.set('Content-Encoding', 'gzip');
    next();
});
app.use('/dist', express.static('dist'))

const { App } = require('./src/app')
const { Admin } = require('./src/admin')
const MailerBuilder = require('./src/services/mailer')
const Database = require('./src/repos')

const appName = 'HCMUS ROOM BOOKING'
const database = new Database.SequelizeDatabase(models)
const mailerBuilder = new MailerBuilder.NodeMailerBuilder(appName)
let myApp = new App(appName, app, database, mailerBuilder)

const adminComponent = new Admin()
myApp.addComponent(adminComponent)

var PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});