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

app.use(express.json())

app.use(express.static(__dirname + '/public/'));


app.get('/sync', function (req, res) {
    models.sequelize.sync().then(function () {
        res.send('database created.');
    });
});



app.get('/laytatcathietbi', function (req, res) {
    models.thiet_bi.findAll().then(dstb => {
        res.send(dstb);
    })
});

// admin
const admin = require("./routes/admin");
const adminApi = require("./routes/admin-api");

// app.get("/dist/*", (req, res, next) => {
//     req.url = req.url + '.gz';
//     res.set('Content-Encoding', 'gzip');
//     next();
// })
app.use("/dist", express.static("dist"));

app.use("/admin/api", adminApi);
app.use("/admin", admin);
app.use("/admin/*", admin);


var PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});