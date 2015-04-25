QUnit.test("flipImage 2x2", function(assert) {
	var upsideDownImageData = ['1', '0', '0', '1'];
	var height = 2;
	var width = 2;
	var upsideDownImage = new image(width, height);
	upsideDownImage.data = upsideDownImageData;

	flipImage(upsideDownImage);

	var expectedImageData = ['0', '1', '1', '0'];
	var actual = upsideDownImage.data;

	assert.deepEqual(actual, expectedImageData);
});

QUnit.test("flipImage 3x3", function(assert) {
	var upsideDownImageData = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	var height = 3;
	var width = 3;
	var upsideDownImage = new image(width, height);
	upsideDownImage.data = upsideDownImageData;

	flipImage(upsideDownImage);

	var expectedImageData = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];
	var actual = upsideDownImage.data;

	assert.deepEqual(actual, expectedImageData);
});

QUnit.test("getLittleEndianHex", function(assert) {
	var testCases = [
						{ input: 0, expected: '\u0000\u0000\u0000\u0000' },
						{ input: 1, expected: '\u0001\u0000\u0000\u0000' },
						{ input: 2, expected: '\u0002\u0000\u0000\u0000' },
						{ input: 256, expected: '\u0000\u0001\u0000\u0000' },
						{ input: 257, expected: '\u0001\u0001\u0000\u0000' },
						{ input: 258, expected: '\u0002\u0001\u0000\u0000' },
						{ input: 65536, expected: '\u0000\u0000\u0001\u0000' },
						{ input: 65537, expected: '\u0001\u0000\u0001\u0000' },
						{ input: 65836, expected: ',\u0001\u0001\u0000' },
						{ input: 2000000, expected: '\u001e\u0000' },
					];

	for(var i = 0; i < testCases.length; i++){
		var input = testCases[i].input;
		var expected = testCases[i].expected;
		assert.deepEqual(getLittleEndianHex(input), expected);
	}
});
