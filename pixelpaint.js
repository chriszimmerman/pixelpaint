var tableWidth;
var tableHeight;
var pixelData;

$(document).ready(function(){
	var isDown = false;

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
			$('#canvas').toggleClass('border-collapse');
			$('table td').toggleClass('grid-on');
			$('table td').toggleClass('grid-off');
		});

		$('#export').click(function(){
			exportImage();
		});

		$(document).mousedown(function() {
			isDown = true;
		})
		.mouseup(function() {
			isDown = false;
		});
		
		createTable();
	}

	function exportImage(){
		var image = createImageFromCanvas();

		var temporaryLink = $("<a>")
							.attr("href", image)
							.attr("download", "image.bmp")
							.appendTo("body");

		temporaryLink[0].click();

		temporaryLink.remove();
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
		
		$('.square').mousedown(function(){
			var color = $('#colorpicker').val();
			$(this).css('backgroundColor', color);
		});

		$(".square").mouseover(function(){
			if(isDown) {
				var color = $('#colorpicker').val();
				$(this).css('backgroundColor', color);
			}
		});

		$('#canvas').on('dragstart', function(event) { event.preventDefault(); });
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
	var reservedBytes = '\x00\x00';
	var bmpDataOffset = '\x36\x00\x00\x00';
	var bytesLeftInHeader = '\x28\x00\x00\x00';
	var bitmapWidth = getLittleEndianHex(img.width);
	var bitmapHeight = getLittleEndianHex(img.height);
	var numberOfColorPlanes = '\x01\x00';
	var bitsPerPixel = '\x20\x00';
	var compression = '\x00\x00\x00\x00';
	var bmpDataByteSize = '\x00\x00\x00\x00';
	var horizontalResolution = '\x13\x0B\x00\x00';
	var verticalResolution = '\x13\x0B\x00\x00';
	var colorsInPalette = '\x00\x00\x00\x00';
	var importantColors = '\x00\x00\x00\x00';

	img.header = 
		'BM' +
		bytesInFile +
		reservedBytes +
		reservedBytes +
		bmpDataOffset +
		bytesLeftInHeader +
		bitmapWidth +
		bitmapHeight +
		numberOfColorPlanes +
		bitsPerPixel +
		compression +
		bmpDataByteSize +
		horizontalResolution +
		verticalResolution +
		colorsInPalette +
		importantColors;
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

function flipImage(image) {
  var flippedImageData = new Array();
   
  for(var x = 0; x < image.width; x++) {
    for(var y = 0; y < image.height; y++) {
      var ny = image.height - 1 - y;
      flippedImageData[(ny * image.width) + x] = image.data[(y * image.width) + x];
    }
  }
   
  image.data = flippedImageData;
}
