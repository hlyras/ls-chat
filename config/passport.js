const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const db = require('./connection');
const lib = require('./lib');

passport.serializeUser(async (user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const query = "SELECT * FROM users WHERE id = '"+id+"';";
    let user = await db(query);
    done(null, user[0]);
});

passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    async (req, username, password, done) => {
        const query = "SELECT * FROM users WHERE username='"+username+"' OR email='"+req.body.email+"';";
        let users = await db(query);
        
        if (users.length) {
            return done(null, false, req.flash('signupMessage', 'Este usuário já existe.'));
        } else {


            const newUserMysql = {
                name: req.body.name,
                email: req.body.email,
                username: username,
                password: bcrypt.hashSync(password, null, null),
                birth: ""+req.body.day+"/"+req.body.month+"/"+req.body.year
            };

            if(!req.body.day || !req.body.month || !req.body.year){
                newUserMysql.birth = "";
            };
            
            const insertQuery = "INSERT INTO users ( name, email, username, password, birth ) values ('"+newUserMysql.name+"', '"+newUserMysql.email+"', '"+newUserMysql.username+"', '"+newUserMysql.password+"', '"+newUserMysql.birth+"')";
            let result = await db(insertQuery);
            newUserMysql.id = result.insertId;
            
            //creating chat to acess suport
            const createChat = "CREATE TABLE lfsdb.room"+newUserMysql.id+" (id INT NOT NULL AUTO_INCREMENT, user VARCHAR(45) NOT NULL, message VARCHAR(255) NOT NULL, PRIMARY KEY (id), UNIQUE INDEX id_UNIQUE (id ASC));";
            await db(createChat);
            
            return done(null, req.user);
        };
    })
);

passport.use(
    'local-login',
    new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    async (req, username, password, done) => {
        const query = "SELECT * FROM users WHERE username = '"+username+"';";
        let users = await db(query);
        
        if (!users.length){
            return done(null, false, req.flash('loginMessage', 'Usuário não encontrado.'))
        };
        
        if (!bcrypt.compareSync(password, users[0].password)){
            return done(null, false, req.flash('loginMessage', 'Senha inválida.'));
        };
        
        return done(null, users[0]);
    })
);

module.exports = passport;