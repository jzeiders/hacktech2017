const Sequelize = require('sequelize');
var sequelize = new Sequelize('tureDB', 'jzeiders', 'Hacktech2017', {
    host: "ture.database.windows.net",
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true
    }
});

var Photo = sequelize.define('photo', {
    url: {
        type: Sequelize.STRING,
        field: "url"
    },
    lat: {
        type: Sequelize.INTEGER,
        field: 'lat'
    },
    lng: {
        type: Sequelize.INTEGER,
        field: "lng"
    },
    tags: {
        type: Sequelize.TEXT,
        field: "tags"
    },
    caption: {
        type: Sequelize.STRING,
        field: "caption" 
    }
}, {
    indexes: [{
        type: "UNIQUE",
        fields: ["url"]
    }]
});

sequelize
    .sync({force: true})
    .then((res) => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
        console.log("Failed to connect to DB");
    })
exports.Photo = Photo;
