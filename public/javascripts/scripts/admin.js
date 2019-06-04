$(function(){
	$("#user-list-btn").on('click', function(){
		let btn = $(this);btn.attr('disabled', true);
		if(document.getElementById('main-user-div').style.display == 'block'){
			return document.getElementById('main-user-div').style.display = 'none';
		};
		$.ajax({
			url: '/user/list',
			method: 'get',
			success: function(response){
				if(response.unauthorized){
					alert(response.unauthorized);
					window.location.href = '/login';
					return;
				};

				let pageSize = 5;
				let page = 0;
				let users = response.users;

				function paging(){
					html = "<table><tr><td>Id</td><td>Nome</td><td>Cargo</td></tr>";
					if(users.length){
					    for (let i = page * pageSize; i < users.length && i < (page + 1) * pageSize;i++){
							html += "<tr>";
							html += "<td id='src_user_id' hidden>"+users[i].id+"</td>";
							html += "<td id='user-show-btn'>"+users[i].id+"</td>";
							html += "<td>"+users[i].name+"</td>";
							html += "<td>"+users[i].job+"</td>";
							html += "<td><a id='user-select-btn'>Alterar</a></td>";
							html += "</tr>";
						};
						html += "</table>";
						document.getElementById('main-user-tbl').innerHTML = html;
						document.getElementById('main-user-div').style.display = 'block';
						document.getElementById('show-user-box').style.display = 'none';
					} else {
						alert('Nenhum usuário encontrado.');
						document.getElementById('main-user-tbl').innerHTML = html;
						document.getElementById('main-user-div').style.display = 'none';
						document.getElementById('show-user-box').style.display = 'none';
					};
				    $('#userPageNumber').text('' + (page + 1) + ' de ' + Math.ceil(users.length / pageSize));
				};

				btn.attr('disabled', false);

				function saleButtonsPaging(){
				    $('#userNext').prop('disabled', users.length <= pageSize || page >= users.length / pageSize - 1);
				    $('#userPrevious').prop('disabled', users.length <= pageSize || page == 0);
				};

				$(function(){
				    $('#userNext').click(function(){
				        if(page < users.length / pageSize - 1){
				            page++;
				            paging();
				            saleButtonsPaging();
				        };
				    });
				    $('#userPrevious').click(function(){
				        if(page > 0){
				            page--;
				            paging();
				            saleButtonsPaging();
				        };
				    });
				    paging();
				    saleButtonsPaging();
				});
			}
		});
	});

	$('#main-user-tbl').on('click', '#user-select-btn', function(){
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

				document.getElementById('main-user-div').style.display = 'none';
				let html = "<table id='show-user-tbl'>";
				html += "<tr>";
				html += "<td>Id</td><td>Nome</td><td>username</td><td>E-mail</td><td>Cargo at.</td>";
				html += "</tr>";
				html += "<tr>";
				html += "<td id='src_user_id' hidden>"+response.user[0].id+"</td>";
				html += "<td id='user-show-btn'>"+response.user[0].id+"</td>";
				html += "<td>"+response.user[0].name+"</td>";
				html += "<td>"+response.user[0].username+"</td>";
				html += "<td>"+response.user[0].email+"</td>";
				html += "<td>"+response.user[0].job+"</td>";
				html += "</tr>";
				html += "</table><br>";
				html += "<div class='menu-box'>"
				html += "<h6 class='underline-generic'>Nova função</h6><br>"
				html += "<select class='btn-generic-menu-medium' id='src_user_newAccess'>";
				response.jobs.forEach((job) => {
					html += "<option value='"+job.code+"'>"+job.name+"</option>";
				});
				html += "</select>";
				html += "<button id='user-updateAccess-btn' class='btn-generic-menu-medium'>Confirmar</button>";
				html += "</div>"
				document.getElementById('show-user-box').innerHTML = html;
				document.getElementById('show-user-box').style.display = 'block';
				btn.css('pointerEvents', 'auto');
			}
		});
	});

	$('#show-user-box').on('click', '#user-updateAccess-btn', function(){
		let btn = $(this);btn.attr('disabled', true);
		let rowEl = $(this).closest('#show-user-box');
		let user_id = rowEl.find('#src_user_id').text();
		let user_newAccess = rowEl.find('#src_user_newAccess').val();

		$.ajax({
			url: '/admin/updateUserAccess',
			method: 'post',
			data: { 
				user_id: user_id,
				user_newAccess: user_newAccess
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

				document.getElementById('show-user-box').style.display = 'none';
				document.getElementById('show-user-tbl').innerHTML = "";
				btn.attr('disabled', false);
			}
		});
	});

	$("#chat-list-btn").on("click", function(event){
		let chatListBox = document.getElementById('chat-list-box') 
		if(chatListBox.style.display=='none'){
			chatListBox.style.display = "block";
		} else {
			chatListBox.style.display = "none";
		};
	});
});