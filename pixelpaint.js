var tableWidth;
var tableHeight;

$(document).ready(function(){
    tableWidth = 10;
    tableHeight = 10;

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
		
		$('.square').click(function(){
			var color = $('#colorpicker').val();
			$(this).css('backgroundColor', color);
		});
	}

    $('#width').val(tableWidth);
    $('#height').val(tableHeight);

    $('#update').click(function(){
		$('#canvas').empty();
		createTable();
	});

	createTable();
});
