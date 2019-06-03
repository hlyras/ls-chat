const User = require('../model/user');
const userController = require('./user');

const homeController = {
	index: (req, res) => {
		if(req.user){
			return res.render('home', { user: req.user });
		};
		res.render('index');
	},
	login: (req, res) => {
		res.render('user/login', { message: req.flash('loginMessage') });
	},
	signup: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['prp','grf','dvp'])){
			return res.redirect('/login');
		};
		res.render('user/signup', { message: req.flash('signupMessage') });
	},
	logout: async (req, res) => {
		await User.supportDisconnect(req.user.id);
		req.logout();
		res.redirect('/');
	},
	support: async (req, res) => {
		if(!req.isAuthenticated()){
			return res.redirect('/login');
		};

		res.render('support', { user: req.user, room: '' });
	}
};

module.exports = homeController;