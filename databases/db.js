const Sequelize = require('sequelize');
var sequelize = new Sequelize('tureDB', 'jzeiders', 'Hacktech2017', {
    host: "ture.database.windows.net",
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true
    }
});

var Photo = sequelize.define('photo', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url: {
        type: Sequelize.STRING,
        field: "url"
    },
    lat: {
        type: Sequelize.DOUBLE,
        field: 'lat'
    },
    lng: {
        type: Sequelize.DOUBLE,
        field: "lng"
    },
    tags: {
        type: Sequelize.TEXT,
        field: "tags"
    },
    caption: {
        type: Sequelize.STRING,
        field: "caption" 
    },
    happiness: {
        type: Sequelize.FLOAT,
        field: 'happiness'
    }
});

sequelize
    .sync()
    .then((res) => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
        console.log("Failed to connect to DB");
    })
exports.Photo = Photo;
exports.sequelize = sequelize;
