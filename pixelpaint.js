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
			$('#imageContainer').attr('src', createImageFromCanvas());
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

});

function image(width, height) {
  this.header = '';
  this.data = Array();
  this.width = width;
  this.height = height;
}

function createImageFromCanvas(){
	var canvasImage = new image(tableWidth, tableHeight);
	setImageHeader(canvasImage);

	var pixelColorData = getPixelRgbData();

	for(var row = 0; row < canvasImage.height; row++){
		for(var column = 0; column < canvasImage.width; column++){
			var pixel = pixelColorData[row][column];
			var redValue = pixel[0];
			var greenValue = pixel[1];
			var blueValue = pixel[2];

			var color = String.fromCharCode(blueValue, greenValue, redValue, 0);
			canvasImage.data[row * canvasImage.width + column] = color;
		}
	}

  flipImage(canvasImage);

  var encodingPrefix = 'data:image/bmp;base64,';
  var unencodedImageString = canvasImage.header + canvasImage.data.join("");
  var supportsBtoa = window.btoa != undefined;
   
  return supportsBtoa ? encodingPrefix + btoa(unencodedImageString) : encodingPrefix + $.base64.encode(unencodedImageString);
}

function setImageHeader(img)
{
  var bytesInFile = getLittleEndianHex(img.width * img.height);
  var bitmapWidth = getLittleEndianHex(img.width);
  var bitmapHeight = getLittleEndianHex(img.height);
         
  img.header = 
    'BM' +                    // Signature
    bytesInFile +             // size of the file (bytes)*
    '\x00\x00' +              // reserved
    '\x00\x00' +              // reserved
    '\x36\x00\x00\x00' +      // offset of where BMP data lives (54 bytes)
    '\x28\x00\x00\x00' +      // number of remaining bytes in header from here (40 bytes)
	bitmapWidth +             // the width of the bitmap in pixels*
    bitmapHeight +            // the height of the bitmap in pixels*
    '\x01\x00' +              // the number of color planes (1)
    '\x20\x00' +              // 32 bits / pixel
    '\x00\x00\x00\x00' +      // No compression (0)
    '\x00\x00\x00\x00' +      // size of the BMP data (bytes)*
    '\x13\x0B\x00\x00' +      // 2835 pixels/meter - horizontal resolution
    '\x13\x0B\x00\x00' +      // 2835 pixels/meter - the vertical resolution
    '\x00\x00\x00\x00' +      // Number of colors in the palette (keep 0 for 32-bit)
    '\x00\x00\x00\x00';       // 0 important colors (means all colors are important)
}

function getPixelRgbData(){
	var rgbValues = [];
	var rgbNumberPattern = /[0-9]+, [0-9]+, [0-9]+/g;
	var pixels = $('.square').get();

	for(var row = 0; row < tableHeight; row++){
		rgbValues.push([]);
		for(var column = 0; column < tableWidth; column++){
			var backgroundColor = $(pixels[row * tableWidth + column]).css('background-color');
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

function getLittleEndianHex(value) {
  var result = [];
   
  for (var bytes = 4; bytes > 0; bytes--) {
    result.push(String.fromCharCode(value & 255));
    value >>= 8;
  }
   
  return result.join('');
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
