var lib = {
	convertDate:function(date){
		var str = date.split('-');
		if(str!=""){
			var convertedDate = str[2]+"-"+str[1]+"-"+str[0];
		} else {
			var convertedDate = "";
		};
		return convertedDate;
	}
};

var product_array = [];
$(function(){
	$('#product-form-filter').on('submit', function(event){
		event.preventDefault();
		var type = document.getElementById('get-type').value;
		var color = document.getElementById('get-color').value;
		$.ajax({
			url: '/product-filter',
			method: 'post',
			data: {type:type, color:color},
			success: function(response) {
				var product_select = document.getElementById('product');
				var html = '<option value="0">Produto</option>';
				response.products.forEach(function(product){
					html += '<option value="'+product.id+'">'+ product.name +'/'+ product.color +'</option>';
				});
				product_select.innerHTML = html;
			}
		});
	});

	$('#add-product-btn').on('click', function(event){
		document.getElementById("add-product-btn").disabled = true;
		event.preventDefault();

		var product_id = document.getElementById('product').value;
		
		product_array.forEach(function(prod){
			if(prod.product_id===product_id){
				product_id = '';
				alert('Produto já inserido');
			};
		});

		if(product_id!='' && product_id!='0'){

		} else {
			alert('Favor selecionar um produto');
			document.getElementById("add-product-btn").disabled = false;
			return;
		};

		var event = document.getElementById("product");
		var product = event.options[event.selectedIndex].text;
		var amount = document.getElementById('amount').value;


		if(amount!='' && amount>0){

		} else {
			alert('Favor inserir a quantidade');
			document.getElementById("add-product-btn").disabled = false;
			return;
		};

		var p = {
			product_id: product_id,
			product: product,
			amount: amount
		};

		product_array.push(p);

		var bodyTable = document.querySelector('tbody');
		var html = "<tr><td id='src-id' hidden>"+ product_id +"</td>\
					<td>"+ product +"</td>\
					<td>"+ amount +"</td>\
					<td><a id='rem-product-btn'>Remove</a></td>\
					</tr>";
		bodyTable.innerHTML += html;

		document.getElementById('amount').value = '';
		document.getElementById("add-product-btn").disabled = false;
	});

	$('table').on('click', '#rem-product-btn', function(){
		var rowEl = $(this).closest('tr');
		var id = rowEl.find('#src-id').text();
		rowEl[0].parentNode.removeChild(rowEl[0]);

		var newArray = [];
		for(var i in product_array){
			if(id!=product_array[i].product_id){
				newArray.push(product_array[i]);
			};
		};
		product_array = newArray;
	});
});