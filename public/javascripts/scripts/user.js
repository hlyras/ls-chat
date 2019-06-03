$(function(){
	$('#user-show-btn').on('click', function(){
		let btn = $(this);btn.css('pointerEvents', 'none');
		let rowEl = $(this).closest('tr');
		let user_id = rowEl.find('#src_user_id').text();

		$.ajax({
			url: '/user/show',
			method: 'post',
			data: { 
				user_id: user_id
			},
			success: function(response){
				if(response.unauthorized){
					alert(response.unauthorized);
					window.location.href = '/login';
					return;
				};

				document.getElementById('show-user-tbl').innerHTML = "";

				let html = "";
				html += "<tr>";
				html += "<td>Id</td><td>Nome</td><td>username</td><td>Profissão</td><td>E-mail</td><td>Nascimento</td>";
				html += "</tr>";
				html += "<tr>";
				html += "<td id='src_user_id'>"+response.user[0].id+"</td>";
				html += "<td hidden><a id='user-show-btn'>"+response.user[0].id+"</a></td>";
				html += "<td>"+response.user[0].name+"</td>";
				html += "<td>"+response.user[0].username+"</td>";
				html += "<td>"+response.user[0].job+"</td>";
				html += "<td>"+response.user[0].email+"</td>";
				html += "<td>"+response.user[0].birth+"</td>";
				html += "</tr>";

				document.getElementById('show-user-tbl').innerHTML = html;
				document.getElementById('show-user-box').style.display = 'block';
				btn.css('pointerEvents', 'auto');
			}
		});
	});

	$("#user-edit-btn").on("click", function(event){
		let userEditBox = document.getElementById('user-edit-box') 
		if(userEditBox.style.display=='none'){
			userEditBox.style.display = "block";
		} else {
			userEditBox.style.display = "none";
		};
	});

	$("#user-editInfo-btn").on("click", function(event){
		let editInfoFrm = document.getElementById('user-editInfo-frm') 
		if(editInfoFrm.style.display=='none'){
			document.getElementById('user-editPassword-frm').style.display = 'none';
			editInfoFrm.style.display = 'block';
		} else {
			editInfoFrm.style.display = 'none';
		};
	});

	$("#user-editPassword-btn").on("click", function(event){
		let editPasswordFrm = document.getElementById('user-editPassword-frm') 
		if(editPasswordFrm.style.display=='none'){
			document.getElementById('user-editInfo-frm').style.display = 'none';
			editPasswordFrm.style.display = 'block';
		} else {
			editPasswordFrm.style.display = 'none';
		};
	});

	$("#user-updateInfo-btn").on("click", function(event){
		let btn = $(this);btn.attr('disabled', true);
		let day = document.getElementById('day').value;
		let month = document.getElementById('month').value;
		let year = document.getElementById('year').value;
		let user_email = document.getElementById('email').value;

		user_birth = ""+day+"/"+month+"/"+year;

		if(!day || !month || !year){
			var user_birth = "";
		};

		if(!user_birth && !user_email){
			btn.attr('disabled', false);
			return alert('É necessário preencher algum campo.');
		};

		$.ajax({
			url: '/user/updateInfo',
			method: 'post',
			data: {
				user_email: user_email,
				user_birth: user_birth
			},
			success: function(response){
				if(response.unauthorized){
					alert(response.unauthorized);
					window.location.href = '/login';
					return;
				};

				if(response.msg){
					alert(response.msg);
					btn.attr('disabled', false);
					return;
				};

				alert(response.done);
				document.getElementById('day').value = "";
				document.getElementById('month').value = "";
				document.getElementById('year').value = "";
				document.getElementById('email').value = "";
				btn.attr('disabled', false);
				$("#user-show-btn").click();
			}
		})
	});

	$("#user-updatePassword-btn").on("click", function(event){
		let btn = $(this);btn.attr('disabled', true);
		let user_password = document.getElementById('password').value;
		let user_confirmPassword = document.getElementById('confirmPassword').value;

		if(user_password!=user_confirmPassword){
			btn.attr('disabled', false);
			return alert("Senhas não conferem.");
		};

		$.ajax({
			url: '/user/updatePassword',
			method: 'post',
			data: {
				user_password: user_password
			},
			success: function(response){
				if(response.unauthorized){
					alert(response.unauthorized);
					window.location.href = '/login';
					return;
				};

				if(response.msg){
					alert(response.msg);
					btn.attr('disabled', false);
					return;
				};

				document.getElementById('password').value = "";
				document.getElementById('confirmPassword').value = "";
				alert(response.done);
				btn.attr('disabled', false);
				$("#user-show-btn").click();
			}
		})
	});
});