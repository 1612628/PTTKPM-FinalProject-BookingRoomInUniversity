var Sequelize=require('sequelize');
var DBConfigDevelopmenteEnv = require('./config.json').development;

const sequelize = new Sequelize(DBConfigDevelopmenteEnv.database, DBConfigDevelopmenteEnv.username,
    DBConfigDevelopmenteEnv.password, {
    // gimme postgres, please!
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log("Success!");
  }).catch((err) => {
    console.log(err);
  });

module.exports = sequelize;