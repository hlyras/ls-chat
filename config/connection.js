const mysql = require('mysql');
const dbconfig = require('./database');

const db = async (query) => {
	const connection = mysql.createConnection(dbconfig.connection);
	connection.query('USE ' + dbconfig.database);
	return new Promise(async (resolve, reject) => {
		connection.query(query, (err, rows) => {
			if(!err){
				connection.end();
				resolve(rows);
			} else {
				connection.end();
				reject(err);
			};
		});
	});
};

db("UPDATE lfsdb.users set support='disconnected'");

module.exports = db;