const db = require('../../config/connection');

const User = function(){
	this.id;
	this.name;
	this.email;
	this.username;
	this.password;
	this.birth;
	this.access;
};

User.list = () => {
	let query = "SELECT * FROM lfsdb.users;";
	return db(query);
};

User.findById = (id) => {
	let query = "SELECT * FROM lfsdb.users WHERE id='"+id+"';";
	return db(query);
};

User.findByUsername = (user) => {
	let query = "SELECT * FROM lfsdb.users WHERE username='"+user.username+"';";
	return db(query);
};

User.findByEmail = (user) => {
	let query = "SELECT * FROM lfsdb.users WHERE email='"+user.email+"';";
	return db(query);
};

User.updateAccess = (user) => {
	let query = "UPDATE lfsdb.users SET access='"+user.newAccess+"', job='"+user.newJob+"' WHERE id='"+user.id+"';";
	return db(query);
};

User.updatePassword = (user) => {
	let query = "UPDATE lfsdb.users SET password='"+user.password+"' WHERE id='"+user.id+"';";
	return db(query);
};

User.updateInfo = (user) => {
	if(user.email && user.birth){
		var query = "UPDATE lfsdb.users SET email='"+user.email+"', birth='"+user.birth+"' WHERE id='"+user.id+"';";
	} else if(user.email && !user.birth){
		var query = "UPDATE lfsdb.users SET email='"+user.email+"' WHERE id='"+user.id+"';";
	} else if(!user.email && user.birth){
		var query = "UPDATE lfsdb.users SET birth='"+user.birth+"' WHERE id='"+user.id+"';";
	};
	return db(query);
};

User.supportConnect = (id) => {
	let query = "UPDATE lfsdb.users SET support='connected' WHERE id='"+id+"';";
	return db(query);
};

User.supportDisconnect = (id) => {
	let query = "UPDATE lfsdb.users SET support='disconnected' WHERE id='"+id+"';";
	return db(query);
};

User.saveMessage = (data, room) => {
	let query = "INSERT INTO lfsdb.room"+room+" (user, message) VALUES ('"+data.user+"', '"+data.message+"');";
	return db(query);
};

User.loadMessages = (room) => {
	let query = "SELECT * FROM lfsdb.room"+room+";";
	return db(query);
};

User.openServiceDeskCall = (id) => {
	let query = "UPDATE lfsdb.users SET serviceDesk='1' WHERE id='"+id+"';";
	return db(query);
};

User.closeServiceDeskCall = (room) => {
	let query = "UPDATE lfsdb.users SET serviceDesk='0' WHERE id='"+room+"';";
	return db(query);
};

module.exports = User;