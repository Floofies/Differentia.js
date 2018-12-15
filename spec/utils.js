var d = global.d;

describe("assert", function () {
	it("should throw an error when input is false", function() {
		const err = new Error("Test");
		expect(_=> d.utils.assert(false, "Test", Error)).toThrow(err);
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
		const err = new TypeError("Argument Test must have a \"nope\" property.");
		expect(_=> d.utils.assert.props(obj, ["hello", "nope"], "Test")).toThrow(err);
	});
	it("should not throw an error when properties are present", function() {
		expect(_=> d.utils.assert.props(obj, ["hello", "goodbye"])).not.toThrow();
	});
});

describe("assert.string", function () {
	it("should throw an error when input is not a string", function() {
		const err = new TypeError("Argument Test must be a String");
		expect(_=> d.utils.assert.string(123, "Test")).toThrow(err);
	});
	it("should not throw an error when input is a string", function() {
		expect(_=> d.utils.assert.string("Hello", "Test")).not.toThrow();
	});
});

describe("assert.number", function () {
	it("should throw an error when input is not a number", function() {
		const err = new TypeError("Argument Test must be a Number");
		expect(_=> d.utils.assert.number("hello", "Test")).toThrow(err);
	});
	it("should not throw an error when input is a number", function() {
		expect(_=> d.utils.assert.number(123, "Test")).not.toThrow();
	});
});

describe("assert.boolean", function () {
	it("should throw an error when input is not a boolean", function() {
		const err = new TypeError("Argument Test must be a Boolean");
		expect(_=> d.utils.assert.boolean("hello", "Test")).toThrow(err);
	});
	it("should not throw an error when input is a boolean", function() {
		expect(_=> d.utils.assert.boolean(true, "Test")).not.toThrow();
	});
});

describe("assert.function", function () {
	it("should throw an error when input is not a function", function() {
		const err = new TypeError("Argument Test must be a Function");
		expect(_=> d.utils.assert.function("hello", "Test")).toThrow(err);
	});
	it("should not throw an error when input is a function", function() {
		expect(_=> d.utils.assert.function(() => {}, "Test")).not.toThrow();
	});
});

describe("assert.object", function () {
	it("should throw an error when input is not an object", function() {
		const err = new TypeError("Argument Test must be an Object");
		expect(_=> d.utils.assert.object([], "Test")).toThrow(err);
		expect(_=> d.utils.assert.object(null, "Test")).toThrow(err);
		expect(_=> d.utils.assert.object("hello", "Test")).toThrow(err);
	});
	it("should not throw an error when input is an object", function() {
		expect(_=> d.utils.assert.object({}, "Test")).not.toThrow();
	});
});

describe("assert.array", function () {
	it("should throw an error when input is not an array", function() {
		const err = new TypeError("Argument Test must be an Array");
		expect(_=> d.utils.assert.array({}, "Test")).toThrow(err);
		expect(_=> d.utils.assert.array(null, "Test")).toThrow(err);
		expect(_=> d.utils.assert.array("hello", "Test")).toThrow(err);
	});
	it("should not throw an error when input is an array", function() {
		expect(_=> d.utils.assert.array([], "Test")).not.toThrow();
	});
});

describe("assert.container", function () {
	it("should throw an error when input is not a container", function() {
		const err = new TypeError("Argument Test must be an Object or Array");
		expect(_=> d.utils.assert.container(null, "Test")).toThrow(err);
		expect(_=> d.utils.assert.container("hello", "Test")).toThrow(err);
	});
	it("should not throw an error when input is a container", function() {
		expect(_=> d.utils.assert.container([], "Test")).not.toThrow();
		expect(_=> d.utils.assert.container({}, "Test")).not.toThrow();
	});
});

describe("assert.iterable", function () {
	const obj = {};
	obj[Symbol.iterator] = function* () {};
	it("should throw an error when input is not an iterable", function() {
		const err = new TypeError("Argument Test must be iterable");
		expect(_=> d.utils.assert.iterable({}, "Test")).toThrow(err);
		expect(_=> d.utils.assert.iterable(null, "Test")).toThrow(err);
		expect(_=> d.utils.assert.iterable("hello", "Test")).toThrow(err);
	});
	it("should not throw an error when input is an iterable", function() {
		expect(_=> d.utils.assert.iterable([], "Test")).not.toThrow();
		expect(_=> d.utils.assert.iterable(obj, "Test")).not.toThrow();
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
