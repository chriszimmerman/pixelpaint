var tableWidth;
var tableHeight;
var pixelData;

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

		$('#export').click(function(){
			pixelData = getCssValues();			
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
				$('#' + tableRowId).append('<td><div class="square" style="background-color: rgb(255, 255, 255);"></div></td>');
			}
		}
		$('table td').addClass('grid-off');
		
		$('.square').click(function(){
			var color = $('#colorpicker').val();
			$(this).css('backgroundColor', color);
		});
	}

	initialize();

	function getCssValues(){
		var rgbValues = [];
		var rgbNumberPattern = /[0-9]+, [0-9]+, [0-9]+/g;
		var pixels = $('.square').get();

		for(var row = 0; row < tableHeight; row++){
			rgbValues.push([]);
			for(var column = 0; column < tableWidth; column++){
				var backgroundColor = $(pixels[row * 10 + column]).css('background-color');
				var rgbValue = backgroundColor.match(rgbNumberPattern);
				rgbValue = rgbValue[0].split(", ");
				rgbValue[0] = Number(rgbValue[0]);
				rgbValue[1] = Number(rgbValue[1]);
				rgbValue[2] = Number(rgbValue[2]);
				rgbValues[row].push(rgbValue);
			}
		}
		return rgbValues;
	}
});

function image(w, h) {
  this.header = '';
  this.data = Array();
  this.width = w;
  this.height = h;
}

function getLittleEndianHex(value) {
  var result = [];
   
  for (var bytes = 4; bytes > 0; bytes--) {
    result.push(String.fromCharCode(value & 255));
    value >>= 8;
  }
   
  return result.join('');
}


function setImageHeader(img)
{
  var numFileBytes = getLittleEndianHex(img.width * img.height);
  var w = getLittleEndianHex(img.width);
  var h = getLittleEndianHex(img.height);
         
  img.header = 
    'BM' +                    // Signature
    numFileBytes +            // size of the file (bytes)*
    '\x00\x00' +              // reserved
    '\x00\x00' +              // reserved
    '\x36\x00\x00\x00' +      // offset of where BMP data lives (54 bytes)
    '\x28\x00\x00\x00' +      // number of remaining bytes in header from here (40 bytes)
    w +                       // the width of the bitmap in pixels*
    h +                       // the height of the bitmap in pixels*
    '\x01\x00' +              // the number of color planes (1)
    '\x20\x00' +              // 32 bits / pixel
    '\x00\x00\x00\x00' +      // No compression (0)
    '\x00\x00\x00\x00' +      // size of the BMP data (bytes)*
    '\x13\x0B\x00\x00' +      // 2835 pixels/meter - horizontal resolution
    '\x13\x0B\x00\x00' +      // 2835 pixels/meter - the vertical resolution
    '\x00\x00\x00\x00' +      // Number of colors in the palette (keep 0 for 32-bit)
    '\x00\x00\x00\x00';       // 0 important colors (means all colors are important)
}

function fillRectangle(img, x, y, w, h, color) {
  for (var ny = y; ny < y + h; ny++) {
    for (var nx = x; nx < x + w; nx++) {
      img.data[ny * img.width + nx] = color;
    }
  }
}

function flipImage(img) {
  var newImgData = new Array();
   
  for(var x = 0; x < img.width; x++) {
    for(var y = 0; y < img.height; y ++) {
      var ny = img.height - 1 - y;
      newImgData[(ny * img.width) + x] = img.data[(y * img.width) + x];
    }
  }
   
  img.data = newImgData;
}

function drawImage() {
  var img = new image(210, 210);
   
  setImageHeader(img);
   
  fillRectangle(img, 0, 0, img.width, img.height, String.fromCharCode(255, 255, 255, 0));
   
  fillRectangle(img, 10, 10, 90, 90, String.fromCharCode(255, 0, 0, 0)); // Blue
  fillRectangle(img, 110, 10, 90, 90, String.fromCharCode(0, 255, 0, 0)); // Green
  fillRectangle(img, 10, 110, 90, 90, String.fromCharCode(0, 0, 255, 0)); // Red
   
  // Flip image vertically  
  flipImage(img);
   
  // If window.btoa is supported, use it since it's often faster
  if(window.btoa != undefined) {
    return 'data:image/bmp;base64,' + btoa(img.header + img.data.join(""));
  }
  // If not, use our base64 library
  else {
    return 'data:image/bmp;base64,' + $.base64.encode(img.header + img.data.join(""));
  }
}

$(document).ready(function() {
  $('#imageContainer').attr('src', drawImage());
});
