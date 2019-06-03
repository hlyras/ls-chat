let user = {
  id: document.getElementById('user-id').innerHTML,
  name: document.getElementById('user-name').innerHTML,
  support: document.getElementById('user-support').innerHTML
};

let room = document.getElementById('access-room').innerHTML;
let chatBox = document.getElementById('chat-box');

function renderMessage(data){
	document.getElementById('chat-box')
		.innerHTML += "<div class='chat-message'><p class='user-name'>"+data.user+" "+lib.genFullDate()+"</p>\
					   <p class='user-message'>"+data.message+"</p></div>";
};

function renderAlert(data){
	document.getElementById('chat-box')
		.innerHTML += "<p class='chat-alert'>"+ data +"</p>";
};

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
	
	
	socket.on('connected', data => {
		renderAlert(data)
  		chatBox.scrollTop = chatBox.scrollHeight;
	});

	socket.on('new user', data => {
		renderAlert(data)
  		chatBox.scrollTop = chatBox.scrollHeight;
	});

	$('#chat-frm').submit((event) => {
		event.preventDefault();

  		let inputMessage = document.getElementById('chat-message').value;

		if(inputMessage.length) {
			var data = {
				user: user.name,
				message: inputMessage
			};

			renderMessage(data);
			socket.emit('send message', data);
			document.getElementById('chat-message').value = '';
  			chatBox.scrollTop = chatBox.scrollHeight;
		};
	});

	socket.on('received message', data => {
		renderMessage(data);
  		chatBox.scrollTop = chatBox.scrollHeight;
	});

	socket.on('previous messages', data => {
		for(i in data){
			renderMessage(data[i]);
		};
  		chatBox.scrollTop = chatBox.scrollHeight;
	});

	socket.on('user left', data => {
		renderAlert(data);
  		chatBox.scrollTop = chatBox.scrollHeight;
	});
} else {
	window.location.href = '/';
};