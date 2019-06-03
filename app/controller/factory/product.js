const userController = require('../user');
const Product = require('../../model/factory/product');
const Jobs = require('../../model/job');

const productController = {
	index: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','grf','cof','dvp','spt','aaf'])){
			return res.redirect('/login');
		};
		res.render('factory/product/index');
	},
	save: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['grf','dvp'])){
			return res.send({ unauthorized: "Usuário não autorizado."});
		};

		const product = {
			cod: parseInt(req.body.product_cod),
			name: req.body.product_name,
			type: req.body.product_type,
			color: req.body.product_color,
			size: req.body.product_size
		};

		var row = await Product.findByCod(product.cod);
		if(row.length){return res.send({ msg: 'Este código de produto já está cadastrado.' })};

		if(!product.cod || product.cod < 1 || product.cod > 9999){return res.send({ msg: 'Código de produto inválido.' })};
		if(!product.name || product.name.length > 15){return res.send({ msg: 'Preencha o nome do produto.' })};
		if(!product.type || product.type.length > 20){return res.send({ msg: 'Preencha o tipo do produto.' })};
		if(!product.color || product.type.length > 10){return res.send({ msg: 'Preencha a cor do produto.' })};
		if(!product.size || product.size.length > 3){return res.send({ msg: 'Preencha o tamanho do produto.' })};

		var row = await Product.save(product);
		let createdProduct = await Product.findById(row.insertId);
		res.send({ done: 'Produto cadastrado com sucesso!', product: createdProduct });
	},
	list: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','grf','cof','dvp','spt'])){
			return res.send({ unauthorized: "Usuário não autorizado."});
		};

		let products = Product.list();
		res.send({ products: products });	
	},
	filter: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','grf','cof','dvp','spt'])){
			return res.send({ unauthorized: "Usuário não autorizado."});
		};

		const product = {
			type: req.body.product_type,
			color: req.body.product_color
		};

		let products = await Product.filter(product);
		res.send({ products: products });
	},
	show: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','grf','cof','dvp','spt'])){
			return response.send({ unauthorized: "Usuário não autorizado."});
		};

		let product = await Product.findByCod(req.body.product_cod);
		res.send({ product: product });		
	}
};

module.exports = productController;