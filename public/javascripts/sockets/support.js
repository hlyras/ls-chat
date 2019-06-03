let user = {
  id: document.getElementById('user-id').innerHTML,
  name: document.getElementById('user-name').innerHTML,
  support: document.getElementById('user-support').innerHTML
};

let room = document.getElementById('access-room').innerHTML;

if(user.support == 'disconnected'){
	if(room){
		user.room = document.getElementById('access-room').innerHTML;
		var socket = io.connect('/support');
		socket.emit('joinRoom', user);
	} else {
		user.room = user.id;
		var socket = io.connect('/support');
		socket.emit('joinRoom', user);
	};
	socket.on('connected', msg => {
		console.log(msg)
	});

	socket.on('new user', message => {
	  console.log(message);
	});

	socket.on('user left', message => {
	  console.log(message);
	});
} else {
	window.location.href = '/';
};
