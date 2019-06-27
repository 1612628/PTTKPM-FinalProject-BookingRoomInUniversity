var jwt = require('jsonwebtoken');
var models = require('./models');
var config = require('../config/config.json');

var controller = {};
controller.getTokenFromCookie = function (cname, cookie) {
    var name = cname + "=";
    var ca = cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

controller.checkTokenKey = function (token) {
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded){
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    } else {
        return false;
    }
};

controller.createTokenKey=function(){
    var token = jwt.sign({ username: username },
        config.secret, {
            expiresIn: '24h'
    });
    return token;
};

module.exports = controller;