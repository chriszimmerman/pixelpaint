QUnit.test("flipImage", function(assert) {
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
