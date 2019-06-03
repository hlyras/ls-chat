$(function(){
	$("#product-save-btn").on('click', function(){
		let btn = $(this);btn.attr('disabled', true);
		let cod = document.getElementById('product_cod').value;
		let name = document.getElementById('product_name').value;
		let type = document.getElementById('product_type').value;
		let color = document.getElementById('product_color').value;
		let size = document.getElementById('product_size').value;

		$.ajax({
			url: '/factory/product/save',
			method: 'post',
			data: { 
				product_cod: cod,
				product_name: name,
				product_type: type,
				product_color: color,
				product_size: size
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
				let cod = document.getElementById('product_cod').value = "";
				let name = document.getElementById('product_name').value = "";
				let type = document.getElementById('product_type').value = "";
				let color = document.getElementById('product_color').value = "";
				let size = document.getElementById('product_size').value = "";
				btn.attr('disabled', false);
			}
		});
	});

	$("#product-filter-btn").on('click', function(){
		let btn = $(this);btn.attr('disabled', true);
		let type = document.getElementById('src_product_type').value;
		let color = document.getElementById('src_product_color').value;

		$.ajax({
			url: '/factory/product/filter',
			method: 'post',
			data: { 
				product_type: type,
				product_color: color
			},
			success: function(response){
				if(response.unauthorized){
					alert(response.unauthorized);
					window.location.href = '/login';
					return;
				};

				let pageSize = 5;
				let page = 0;
				let products = response.products;

				function paging(){
					html = "<tr><td>Cód</td><td>Tipo</td><td>Nome</td><td>Tamanho</td><td>Cor</td></tr>";
					if(products.length){
					    for (let i = page * pageSize; i < products.length && i < (page + 1) * pageSize;i++){
							html += "<tr>";
							html += "<td id='src_product_cod' hidden>"+products[i].cod+"</td>";
							html += "<td><a id='product-show-btn'>"+products[i].cod+"</a></td>";
							html += "<td>"+products[i].type+"</td>";
							html += "<td>"+products[i].name+"</td>";
							html += "<td>"+products[i].size+"</td>";
							html += "<td>"+products[i].color+"</td>";
							html += "</tr>";
						};
						document.getElementById('main-product-tbl').innerHTML = html;
						document.getElementById('main-product-div').style.display = 'block';
					} else {
						alert('Nenhum produto encontrado.');
						document.getElementById('main-product-tbl').innerHTML = html;
						document.getElementById('main-product-div').style.display = 'none';
					};
				    $('#productPageNumber').text('' + (page + 1) + ' de ' + Math.ceil(products.length / pageSize));
				};

				btn.attr('disabled', false);

				function saleButtonsPaging(){
				    $('#productNext').prop('disabled', products.length <= pageSize || page >= products.length / pageSize - 1);
				    $('#productPrevious').prop('disabled', products.length <= pageSize || page == 0);
				};

				$(function(){
				    $('#productNext').click(function(){
				        if(page < products.length / pageSize - 1){
				            page++;
				            paging();
				            saleButtonsPaging();
				        };
				    });
				    $('#productPrevious').click(function(){
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

	$('#main-product-tbl').on('click', '#product-show-btn', function(){
		let btn = $(this);btn.css('pointerEvents', 'none');
		let rowEl = $(this).closest('tr');
		let cod = rowEl.find('#src_product_cod').text();

		$.ajax({
			url: '/factory/product/show',
			method: 'post',
			data: { 
				product_cod: cod
			},
			success: function(response){
				if(response.unauthorized){
					alert(response.unauthorized);
					window.location.href = '/login';
					return;
				};

				document.getElementById('show-product-box').innerHTML = "";
				let html = "<h5>Dados do produto "+response.product[0].type+" "+response.product[0].name+" "+response.product[0].size+" "+response.product[0].color+"</h5><br>";
				html += "<table>";
				html += "<tr>";
				html += "<td>Id</td><td>Cód</td><td>Tipo</td><td>Nome</td><td>Tamanho</td><td>Cor</td><td>Qtd</td>";
				html += "</tr>";
				html += "<tr>";
				html += "<td>"+response.product[0].id+"</td>";
				html += "<td>"+response.product[0].cod+"</td>";
				html += "<td>"+response.product[0].type+"</td>";
				html += "<td>"+response.product[0].name+"</td>";
				html += "<td>"+response.product[0].size+"</td>";
				html += "<td>"+response.product[0].color+"</td>";
				html += "<td>"+response.product[0].amount+"</td>";
				html += "</tr>";
				html += "</table>";
				document.getElementById('show-product-box').innerHTML = html;
				document.getElementById('show-product-box').style.display = 'block';
				btn.css('pointerEvents', 'auto');
			}
		});
	});
});