var tableWidth;
var tableHeight;

$(document).ready(function(){
	function initialize(){
		tableWidth = 10;
		tableHeight = 10;

		$('#width').val(tableWidth);
		$('#height').val(tableHeight);

		$('#update').click(function(){
			$('#canvas').empty();
			createTable();
		});

		$('#grid').click(function(){
			$('table td').toggleClass('grid-on');
			$('table td').toggleClass('grid-off');
		});
		
		createTable();
	}

	function createTable(){
		tableWidth = $('#width').val();
		tableHeight = $('#height').val();

		for(var i = 0; i < tableHeight; i++){
			var tableRowId = 'row' + i;
			
			$('#canvas').append('<tr id="' + tableRowId + '"></tr>"');
			
			for(var j = 0; j < tableWidth; j++){
				$('#' + tableRowId).append('<td><div class="square"></div></td>');
			}
		}
		$('table td').addClass('grid-off');
		
		$('.square').click(function(){
			var color = $('#colorpicker').val();
			$(this).css('backgroundColor', color);
		});
	}

	function foo(){
		var pixel = '\xff\x00\x00';
		var src = 'data:image/bmp;base64,' + btoa(pixel);
		var img = document.createElement('img');
		img.src = src;

		$('body').append(img);
	};

	initialize();
	foo();
});
