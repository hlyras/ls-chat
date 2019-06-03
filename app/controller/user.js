const User = require('../model/user');
const Jobs = require('../model/job');
const bcrypt = require('bcrypt-nodejs');

const userController = {
	index: (req, res) => {
		res.render('user/profile', { user: req.user });
	},
	verify: (req, res, next) => {
		if (req.isAuthenticated()){ return next() };
		res.redirect('/login');
	},
	verifyAccess: async (req, res, access) => {
		if(req.isAuthenticated()){
			for(let i in access){
				if(access[i]==req.user.access){
					return true;
				};
			};
		};
		return false;
	},
	login: (req, res) => {
		req.session.cookie.maxAge = 1000 * 60 * 30;
		res.redirect('/');
	},
	signup: (req, res) => {
		req.session.cookie.maxAge = 1000 * 60 * 30;
		res.redirect('/');
	},
	list: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','grf','dvp'])){
			return res.send({ unauthorized: "Usuário não autorizado."});
		};
		let users = await User.list();
		res.send({ users: users });
	},
	show: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','grf','dvp'])){
			return res.send({ unauthorized: "Usuário não autorizado."});
		};

		let user = await User.findById(req.body.user_id);
		res.send({ user: user, jobs: Jobs });
	},
	updateInfo: async (req, res) => {
		if(!req.isAuthenticated()){
			res.send({ unauthorized: "Não autorizado" });
		};

		const user = {
			id: req.user.id,
			email: req.body.user_email,
			birth: req.body.user_birth
		};

		if(user.email){
			var row = await User.findByEmail(user);
			console.log(row);
			if(row.length){ return res.send({ msg: "Este e-mail já está cadastrado." })};
		};

		row = await User.updateInfo(user);
		res.send({ done: "Informações atualizadas com sucesso." });
	},
	updatePassword: async (req, res) => {
		if(!req.isAuthenticated()){
			res.send({ unauthorized: "Não autorizado" });
		};

		if(!req.body.user_password){
			return res.send({ msg: 'Os campos devem ser preenchidos' });
		};

		const user = {
			id: req.user.id,
			password: bcrypt.hashSync(req.body.user_password, null, null) 
		};

		let row = await User.updatePassword(user);
		res.send({ done: "Senha alterada com sucesso." });
	}
};

module.exports = userController;