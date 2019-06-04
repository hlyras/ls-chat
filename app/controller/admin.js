const userController = require('./user');
const User = require('../model/user');
const Jobs = require('../model/job');

const adminController = {
	index: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','dvp','spt'])){
			return res.redirect('/login');
		};

		let users = await User.list();

		res.render('admin/index', { users: users });
	},
	updateUserAccess: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','dvp'])){
			return res.redirect('/login');
		};
		let user = {
			id: req.body.user_id,
			newAccess: req.body.user_newAccess,
			newJob: undefined
		};

		var row = await User.findById(user.id);
		if(row[0].access=='prp' || row[0].access=='dvp'){
			return res.send({ msg: 'Você não tem permissão para alterar os privilégios deste usuário.' })
		};

		for(i in Jobs){
			if(Jobs[i].code==user.newAccess){
				user.newJob = Jobs[i].name;
			};
		};

		if(!await User.updateAccess(user)){
			return res.send({ err: 'Ocorreu um erro, favor contatar o supporte'});
		};

		res.send({ done: "Privilégio atualizado com sucesso." });
	},
	support: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','dvp','spt'])){
			return res.redirect('/login');
		};

		res.render('admin/support', { user: req.user, room: req.body.room, serviceDesk: req.body.serviceDesk });
	}
};

module.exports = adminController;