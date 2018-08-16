var d = global.d;

describe("assert", function () {
	it("should throw an error when input is false", function() {
		expect(_=> d.utils.assert(false, "Test", Error)).toThrow(new Error("Test"));
	});
	it("should not throw an error when input is true", function() {
		expect(_=> d.utils.assert(true, "Test", Error)).not.toThrow();
	});
});

describe("assert.props", function () {
	const obj = {
		hello: "world",
		goodbye: "moonman"
	};
	it("should throw an error when properties are missing", function() {
		expect(_=> d.utils.assert.props(obj, ["hello", "nope"], "Test")).toThrow(new TypeError("Argument Test must have a \"nope\" property."));
	});
	it("should not throw an error when properties are present", function() {
		expect(_=> d.utils.assert(obj ["hello", "goodbye"])).not.toThrow();
	});
});

describe("assert.argType", function () {
	it("should throw an error when input is not a function", function() {
		expect(_=> d.utils.assert(123, "Test", Error)).toThrow(new Error("Test"));
	});
	it("should not throw an error when input is a function", function() {
		expect(_=> d.utils.assert(() => {}, "Test", Error)).not.toThrow();
	});
});

describe("isIterable", function () {
	var array = [];
	var object = {};
	it("should return true if the input is an Iterable", function () {
		expect(d.utils.isIterable(array)).toBe(true);
		expect(d.utils.isIterable(new Map())).toBe(true);
	});
	it("should return false if the input is not an Iterable", function () {
		expect(d.utils.isContainer(12345)).toBe(false);
		expect(d.utils.isContainer("Hello World")).toBe(false);
		expect(d.utils.isContainer(true)).toBe(false);
		expect(d.utils.isContainer(false)).toBe(false);
	});
});

describe("isContainer", function () {
	var array = [];
	var object = {};
	it("should return true if the input is an Object or Array", function () {
		expect(d.utils.isContainer(array)).toBe(true);
		expect(d.utils.isContainer(object)).toBe(true);
	});
	it("should return false if the input is not an Object or Array", function () {
		expect(d.utils.isContainer(12345)).toBe(false);
		expect(d.utils.isContainer("Hello World")).toBe(false);
		expect(d.utils.isContainer(true)).toBe(false);
		expect(d.utils.isContainer(false)).toBe(false);
	});
});

describe("isObject", function () {
	it("should return true", function () {
		expect(d.utils.isObject({})).toEqual(true);
	});

	it("should return false", function() {
		expect(d.utils.isObject([])).toEqual(false);
		expect(d.utils.isObject()).toEqual(false);
	});
});

describe("isPrimitive", function () {
	var primitives = ["string", false, 4, Symbol("prop")];
	it("should return true for all valid primitives", function () {
		primitives.forEach(function (elem) {
			expect(d.utils.isPrimitive(elem)).toEqual(true);
		});
	});
});

describe("createContainer", function () {
	it('should create an array', function () {
		var isArr = d.utils.createContainer([]);
		expect(isArr).toEqual([]);
	});

	it('should create an object', function () {
		var isObj = d.utils.createContainer({});
		expect(isObj).toEqual({});
	});
});

describe("getContainerLength", function () {
	var array = [1, 2, 3, 4, 5];
	var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
	it("should count 5 items in each container", function () {
		expect(d.utils.getContainerLength(array)).toBe(5);
		expect(d.utils.getContainerLength(object)).toBe(5);
	});
});
