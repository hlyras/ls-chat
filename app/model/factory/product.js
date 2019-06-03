const db = require('../../../config/connection');

const Product = function(){
	this.id;
	this.name;
	this.type;
	this.color;
	this.size;
	this.amount = 0;
	this.pictures = [];
};

Product.save = async (product) => {
	let query = "INSERT INTO lfsdb.products (cod, name, type, color, size) VALUES ('"
		+product.cod+"', '"
		+product.name+"','"
		+product.type+"','"
		+product.color+"','"
		+product.size+"');";
	return db(query);
};

Product.list = async () => {
		let query = "SELECT * FROM lfsdb.products;";
		return db(query);
};

Product.findById = async (id) => {
	let query = "SELECT * FROM lfsdb.products WHERE id='"+id+"';";
	return db(query);
};

Product.findByCod = async (cod) => {
	let query = "SELECT * FROM lfsdb.products WHERE cod='"+cod+"';";
	return db(query);
};

Product.filter = async (product) => {
	if(product.type && product.color){
		var query = "SELECT * FROM lfsdb.products WHERE type='"+product.type+"' AND color='"+product.color+"' ORDER BY cod ASC;";
	} else if(product.type && !product.color){
		var query = "SELECT * FROM lfsdb.products WHERE type='"+product.type+"' ORDER BY cod ASC;";
	} else if(!product.type && product.color){
		var query = "SELECT * FROM lfsdb.products WHERE color='"+product.color+"' ORDER BY cod ASC;";
	} else if(!product.type && !product.color){
		var query = "SELECT * FROM lfsdb.products ORDER BY cod ASC;";
	};
	return db(query);
};

module.exports = Product;