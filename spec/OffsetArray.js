var d = global.d;

describe("OffsetArray", function () {
	it("should contain elements added via push", function () {
		const source = [1, 2, 3, 4, 5];
		const oa = new d.OffsetArray();
		for (var number of source) {
			oa.push(number);
		}
		for (var number of source) {
			expect(oa.item(number - 1)).toEqual(number);
		}
	});
	it("should contain elements added from an iterable", function () {
		const source = [1, 2, 3, 4, 5];
		const oa = new d.OffsetArray(source);
		for (var number of source) {
			expect(oa.item(number - 1)).toEqual(number);
		}
	})
	it("should remove and return the last element via pop", function () {
		const source = [1, 2, 3, 4, 5];
		const expected = [5, 4, 3, 2, 1];
		const oa = new d.OffsetArray(source);
		for (var number of expected) {
			expect(oa.pop()).toEqual(number);
		}
	});
	it("should remove and return the first element via shift", function () {
		const source = [1, 2, 3, 4, 5];
		const oa = new d.OffsetArray(source);
		for (var number of source) {
			expect(oa.shift()).toEqual(number);
		}
	});
});

