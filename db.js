const Sequelize = require('sequelize');
var sequelize = new Sequelize(
	'tureDB',
	'jzeiders',
	'2Tureture', {
		dialect: 'postgres',
		host: process.env.POSTGRES_HOST,
		port: parseInt(process.env.POSTGRES_PORT)
	}
);
var photo = sequelize.define('photo', {
	url: {
		type: Sequelize.STRING
	},
	location: {
		type: Sequelize.GEOMETRY('POINT')
	},
	captions: {
		type: Sequelize.ARRAY(Sequelize.STRING)
	},
    indexes: [
        {
            type: "UNIQUE",
            fields: ["url"]
        }
    ]
});
