var d = global.d;

describe("Bundle / Entry Point", function () {
	it("should be an Object", function () {
		expect(d).not.toBeUndefined();
		expect(typeof d).toBe("object");
	});
});