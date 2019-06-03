const User = require('../app/model/user');

module.exports = function(io) {
	io.of('/support').on('connection', (socket) => {
		socket.on('joinRoom', async (user) => {
			socket.user_id = user.id;
			socket.user_name = user.name;
			socket.user_status = user.support;
			socket.room = user.room;

			await User.supportConnect(socket.user_id);
			console.log('user '+socket.user_name+' has connected!');
			
			socket.join(socket.room, () => {
				socket.broadcast.to(socket.room).emit('new user', socket.user_name+' entrou na sala.');
				socket.emit('connected', 'Bem vindo '+socket.user_name+"!");

				socket.on('disconnect', async () => {
					console.log('user '+socket.user_name+' has disconnected!');
					
					socket.broadcast.to(socket.room).emit('user left', socket.user_name+' saiu da sala.');
					await User.supportDisconnect(socket.user_id);
				});
			});
		});
	});
};