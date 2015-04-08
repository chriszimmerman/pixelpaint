//jquery 1.9.1
$(document).ready(function(){
    var tableSize = 10;
    
    for(var i = 0; i < tableSize; i++){
        var tableRowId = 'row' + i;
        
        $('#canvas').append('<tr id="' + tableRowId + '"></tr>"');
        
        for(var j = 0; j < tableSize; j++){
            $('#' + tableRowId).append('<td><div class="square"></div></td>');            
        }
        
    }
    
    $('.square').click(function(){
        var color = $('#colorpicker').val();
         $(this).css('backgroundColor', color);
    });
});
