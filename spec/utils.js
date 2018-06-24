var d = global.d;

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

describe("getContainerLength", function () {
	var array = [1, 2, 3, 4, 5];
	var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
	it("should count 5 items in each container", function () {
		expect(d.utils.getContainerLength(array)).toBe(5);
		expect(d.utils.getContainerLength(object)).toBe(5);
	});
});

describe("assert", function () {
	var func = [
		'argType',
		'string',
		'number',
		'boolean',
		'function',
		'object',
		'array',
		'container'
	];

	it("should have have thunks defined on assert", function () {
		func.forEach(function(elem, index) {
			expect(d.utils.assert[elem]).not.toBe(undefined);
		});
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
