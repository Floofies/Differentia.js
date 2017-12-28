if (typeof require !== "undefined") {
	var differentia = require('../prod-build/dist/differentia.js');
}

describe("differentia", function () {
	it("should be an Object", function () {
		expect(differentia).not.toBeUndefined();
		expect(typeof differentia).toBe("object");
	});
	var modules = [
		'isContainer',
		'getContainerLength',
		'bfs',
		'dfs',
		'diff',
		'clone',
		'diffClone',
		'deepFreeze',
		'deepSeal',
		'forEach',
		'find',
		'some',
		'every',
		'map',
		'nodePaths',
		'paths',
		'findPath',
		'findPaths',
		'findShortestPath',
		'diffPaths',
		'filter'
	];
	it("should contain \"" + modules.join("\", \"") + "\"", function () {
		modules.forEach(moduleName => expect(moduleName in differentia).toBe(true));
	});
});

const d = differentia;

function createTestObject() {
	return [
		{
			"id": 1,
			"name": "Leanne Graham",
			"username": "Bret",
			"email": "Sincere@april.biz",
			"regex": new RegExp("^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$"),
			"address": {
				"street": "Kulas Light",
				"suite": "Apt. 556",
				"city": "Gwenborough",
				"zipcode": 92998,
				"geo": {
					"lat": -37.3159,
					"lng": 81.1496
				}
			},
			"website": null,
			"company": {
				"active": false,
				"name": "Romaguera-Crona",
				"catchPhrase": "Multi-layered client-server neural-net",
				"bs": "harness real-time e-markets"
			}
		},
		{
			"id": 2,
			"name": "Ervin Howell",
			"username": "Antonette",
			"email": "Shanna@melissa.tv",
			"regex": new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$"),
			"address": {
				"street": "Victor Plains",
				"suite": "Suite 879",
				"city": "Wisokyburgh",
				"zipcode": 90566,
				"geo": {
					"lat": -43.9509,
					"lng": -34.4618
				}
			},
			"website": null,
			"company": {
				"active": true,
				"name": "Deckow-Crist",
				"catchPhrase": "Proactive didactic contingency",
				"bs": "synergize scalable supply-chains"
			}
		}
	];
}
var testObjects = {};
testObjects["Multidimensional Acyclic"] = createTestObject();
testObjects["Linear Acyclic"] = ["one", "two", "three"];
// Fourth element is a cycle
testObjects["Linear Cyclic"] = ["one", "two", "three"];
testObjects["Linear Cyclic"][3] = testObjects["Linear Cyclic"];
// Nested Arrays
testObjects["Nested Acyclic"] = ["one", "two", [
	"three", "four", [
		"five", "six"
	]
]];
testObjects["Nested Cyclic"] = ["one", "two", [
	"three", "four", [
		"five", "six"
	]
]];
testObjects["Nested Cyclic"][2].push(testObjects["Nested Cyclic"][2][2]);
// `otherUser` properties are a cycle
testObjects["Multidimensional Cyclic"] = createTestObject();
testObjects["Multidimensional Cyclic"][0].otherUser = testObjects["Multidimensional Cyclic"][1];
testObjects["Multidimensional Cyclic"][1].otherUser = testObjects["Multidimensional Cyclic"][0];
// Useful for mapping shortest path
testObjects["Multipath"] = {
	path1: {
		path12: {
			path13: [0, 1, 2, 3, 4]
		}
	},
	path2: {
		path22: [0, 1, 2, 3, 4]
	}
};

function createKeyCounter() {
	var testObject = testObjects["Multidimensional Cyclic"];
	var keyCounts = {};
	for (var key in testObject) {
		keyCounts[key] = 0;
	}
	for (var key in testObject[0]) {
		keyCounts[key] = 0;
	}
	for (var key in testObject[0]["address"]) {
		keyCounts[key] = 0;
	}
	for (var key in testObject[0]["address"]["geo"]) {
		keyCounts[key] = 0;
	}
	for (var key in testObject[0]["company"]) {
		keyCounts[key] = 0;
	}
	return keyCounts;
}

function testLength(obj) {
	if (Array.isArray(obj)) {
		return obj.length;
	}
	if (obj !== null && typeof obj === "object") {
		return Object.keys(obj).length;
	}
	throw new TypeError("The given parameter must be an Object or Array");
}

function diff(subject, compare, search = null) {
	var noIndex = search === null;
	if (noIndex && testLength(subject) !== testLength(compare)) {
		return true;
	}
	if (noIndex) {
		search = subject;
	}
	var tuple = { subject, search, compare };
	var map = new Map();
	map.set(search, tuple);
	if (diff.test(tuple, map, noIndex) === true) {
		return true;
	}
	return false;
}

// Checks for which "newer" RegExp properties are supported.
var supportedRegExpProps = {
	sticky: "sticky" in RegExp.prototype,
	unicode: "unicode" in RegExp.prototype,
	flags: "flags" in RegExp.prototype
};

//FIXME: I can't traverse nested arrays.
diff.test = function (tuple, map, noIndex) {
	for (var accessor in tuple.search) {
		if (!(accessor in tuple.subject)) {
			continue;
		}
		if (!("compare" in tuple) && !(typeof tuple.compare !== "object") || !(accessor in tuple.compare)) {
			return true;
		}
		var subjectProp = tuple.subject[accessor];
		var compareProp = tuple.compare[accessor];
		var searchProp = tuple.search[accessor];
		if ((Array.isArray(subjectProp) && Array.isArray(compareProp))
			|| (typeof subjectProp === "object" && typeof compareProp === "object")
			&& (subjectProp !== null && compareProp !== null)) {
			if (subjectProp instanceof RegExp && compareProp instanceof RegExp) {
				if (
					subjectProp.source !== compareProp.source
					|| subjectProp.ignoreCase !== compareProp.ignoreCase
					|| subjectProp.global !== compareProp.global
					|| subjectProp.multiline !== compareProp.multiline
					|| (supportedRegExpProps.sticky && subjectProp.sticky !== compareProp.sticky)
					|| (supportedRegExpProps.unicode && subjectProp.unicode !== compareProp.unicode)
					|| (supportedRegExpProps.flags && subjectProp.flags !== compareProp.flags)
				) {
					return true;
				}
			} else if (noIndex && testLength(subjectProp) !== testLength(compareProp)) {
				return true;
			}
			if (map.has(searchProp)) {
				continue;
			}
			// Node has not been seen before, so traverse it
			var nextTuple = {};
			// Travese the Tuple's properties
			for (var unit in tuple) {
				if (
					(
						unit === "search"
						|| unit === "subject"
						|| (Array.isArray(tuple[unit][accessor]) || typeof tuple[unit][accessor] === "object")
					)
					&& accessor in tuple[unit]
				) {
					nextTuple[unit] = tuple[unit][accessor];
				}
			}
			map.set(searchProp, nextTuple);
			if (diff.test(nextTuple, map, noIndex) === true) {
				return true;
			}
		} else if (subjectProp !== compareProp) {
			return true;
		}
	}
}

describe("testLength", function () {
	var array = [1, 2, 3, 4, 5];
	var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
	it("should count 5 items in each container", function () {
		expect(testLength(array)).toBe(5);
		expect(testLength(object)).toBe(5);
	});
});

describe("testDiff", function () {
	it("should return true when two objects differ", function () {
		expect(diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"])).toBe(true);
		expect(diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
		expect(diff(testObjects["Linear Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
		expect(diff(testObjects["Nested Cyclic"], testObjects["Nested Acyclic"])).toBe(true);
	});
	it("should return false when two objects are the same", function () {
		expect(diff(testObjects["Linear Acyclic"], testObjects["Linear Acyclic"])).toBe(false);
		expect(diff(testObjects["Linear Cyclic"], testObjects["Linear Cyclic"])).toBe(false);
		expect(diff(testObjects["Multidimensional Acyclic"], testObjects["Multidimensional Acyclic"])).toBe(false);
		expect(diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Cyclic"])).toBe(false);
		expect(diff(testObjects["Nested Cyclic"], testObjects["Nested Cyclic"])).toBe(false);
		expect(diff(testObjects["Nested Acyclic"], testObjects["Nested Acyclic"])).toBe(false);
	});
});

describe("isContainer", function () {
	var array = [];
	var object = {};
	it("should return true if the input is an Object or Array", function () {
		expect(d.isContainer(array)).toBe(true);
		expect(d.isContainer(object)).toBe(true);
	});
	it("should return false if the input is not an Object or Array", function () {
		expect(d.isContainer(12345)).toBe(false);
		expect(d.isContainer("Hello World")).toBe(false);
		expect(d.isContainer(true)).toBe(false);
		expect(d.isContainer(false)).toBe(false);
	});
});

describe("getContainerLength", function () {
	var array = [1, 2, 3, 4, 5];
	var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
	it("should count 5 items in each container", function () {
		expect(d.getContainerLength(array)).toBe(5);
		expect(d.getContainerLength(object)).toBe(5);
	});
});

describe("bfs", function () {
	it("should throw a TypeError when no arguments are given", function () {
		expect(() => d.bfs().next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
	});
	it("should throw a TypeError when any arguments are the wrong type", function () {
		expect(() => d.bfs(123).next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
		expect(() => d.bfs("test").next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
		expect(() => d.bfs({}, 123).next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
		expect(() => d.bfs({}, "test").next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
	});
	it("should iterate all nodes and properties", function () {
		var keyCounts = createKeyCounter();
		var testObject = testObjects["Multidimensional Cyclic"];
		var iterator = d.bfs(testObject, testObject);
		var iteration = iterator.next();
		while (!iteration.done) {
			keyCounts[iteration.value.accessor]++;
			iteration = iterator.next();
		}
		//console.info("bfs Traversal & Iteration Results:");
		for (var accessor in keyCounts) {
			//console.info("Accessor \"" + accessor + "\" was visited " + keyCounts[accessor] + " time(s).");
			expect(keyCounts[accessor] > 0).toBe(true);
		}
	});
});

describe("dfs", function () {
	it("should throw a TypeError when no arguments are given", function () {
		expect(() => d.dfs().next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
	});
	it("should throw a TypeError when any arguments are the wrong type", function () {
		expect(() => d.dfs(123).next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
		expect(() => d.dfs("test").next()).toThrow(new TypeError("Argument 1 must be an Object or Array"));
		expect(() => d.dfs({}, 123).next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
		expect(() => d.dfs({}, "test").next()).toThrow(new TypeError("Argument 2 must be a non-empty Object or Array"));
	});
	it("should iterate all nodes and properties", function () {
		var keyCounts = createKeyCounter();
		var testObject = testObjects["Multidimensional Cyclic"];
		var iterator = d.dfs(testObject, testObject);
		var iteration = iterator.next();
		while (!iteration.done) {
			keyCounts[iteration.value.accessor]++;
			iteration = iterator.next();
		}
		//console.info("bfs Traversal & Iteration Results:");
		for (var accessor in keyCounts) {
			//console.info("Accessor \"" + accessor + "\" was visited " + keyCounts[accessor] + " time(s).");
			expect(keyCounts[accessor] > 0).toBe(true);
		}
	});
});

describe("forEach", function () {
	it("should iterate all nodes and properties", function () {
		var keyCounts = createKeyCounter();
		var testObject = testObjects["Multidimensional Cyclic"];
		d.forEach(testObject, function (value, accessor, object) {
			keyCounts[accessor]++;
		});
		//console.info("forEach Traversal & Iteration Results:");
		for (var accessor in keyCounts) {
			//console.info("Accessor \"" + accessor + "\" was visited " + keyCounts[accessor] + " time(s).");
			expect(keyCounts[accessor] > 0).toBe(true);
		}
	});
});

describe("diff", function () {
	it("should return true when two objects differ", function () {
		expect(d.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"])).toBe(true);
		expect(d.diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
		expect(d.diff(testObjects["Linear Cyclic"], testObjects["Multidimensional Acyclic"])).toBe(true);
	});
	it("should return false when two objects are the same", function () {
		expect(d.diff(testObjects["Linear Acyclic"], testObjects["Linear Acyclic"])).toBe(false);
		expect(d.diff(testObjects["Linear Cyclic"], testObjects["Linear Cyclic"])).toBe(false);
		expect(d.diff(testObjects["Multidimensional Acyclic"], testObjects["Multidimensional Acyclic"])).toBe(false);
		expect(d.diff(testObjects["Multidimensional Cyclic"], testObjects["Multidimensional Cyclic"])).toBe(false);
	});
	it("should return true when two objects differ using the search index", function () {
		expect(d.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"], { 3: null })).toBe(true);
	});
	it("should return false when two objects are the same using the search index", function () {
		expect(d.diff(testObjects["Linear Acyclic"], testObjects["Linear Cyclic"], { 1: null })).toBe(false);
	});
});

describe("clone", function () {
	it("should make an exact copy of the subject", function () {
		var clone = d.clone(testObjects["Linear Acyclic"]);
		expect(diff(clone, testObjects["Linear Acyclic"])).toBe(false);
		clone = d.clone(testObjects["Linear Cyclic"]);
		expect(diff(clone, testObjects["Linear Cyclic"])).toBe(false);
		clone = d.clone(testObjects["Multidimensional Cyclic"]);
		expect(diff(clone, testObjects["Multidimensional Cyclic"])).toBe(false);
	});
	it("should clone properties using the search index", function () {
		var clone = d.clone(testObjects["Linear Acyclic"], { 2: null });
		var search = { 2: Number };
		expect(diff(clone, testObjects["Linear Acyclic"], search)).toBe(false);
		search = [{
			address: {
				geo: {
					lat: null
				}
			}
		}];
		clone = d.clone(testObjects["Multidimensional Cyclic"], search);
		expect(diff(clone, testObjects["Multidimensional Cyclic"], search)).toBe(false);
	});
});

describe("diffClone", function () {
	var subject = { "hello": "world", "how": "are you?", "have a": "good day" };
	var compare = { "hello": "world", "whats": "up?", "have a": "good night" };
	it("should clone properties that differ", function () {
		var clone = d.diffClone(subject, compare);
		expect(diff(clone, { "how": "are you?", "have a": "good day" })).toBe(false);
	});
	it("should clone properties that differ using the search index", function () {
		var clone = d.diffClone(subject, compare, { "how": null });
		expect(diff(clone, { "how": "are you?" })).toBe(false);
	});
});

describe("find", function () {
	it("should return a value if it passes the test", function () {
		expect(d.find(testObjects["Multidimensional Cyclic"], function (value, accessor, object) {
			return value === -37.3159;
		})).toBe(-37.3159);
	});
	it("should return undefined if no values pass the test", function () {
		expect(d.find(testObjects["Multidimensional Cyclic"], function (value, accessor, object) {
			return value === "This string does not exist in the test object!";
		})).toBeUndefined();
	});
});

describe("every", function () {
	var testObject = [10, 11, 12, 13, 14, 15];
	it("should return true if all values pass the test", function () {
		expect(d.every(testObject, function (value, accessor, object) {
			return typeof value === "number" && value >= 10;
		})).toBe(true);
	});
	it("should return false if one value fails the test", function () {
		expect(d.every(testObject, function (value, accessor, object) {
			return typeof value === "number" && value < 13;
		})).toBe(false);
	});
});

describe("some", function () {
	var testObject = [10, 11, 12, 13, 14, 15];
	it("should return true if one value passes the test", function () {
		expect(d.some(testObject, function (value, accessor, object) {
			return typeof value === "number" && value === 13;
		})).toBe(true);
	});
	it("should return false if no values pass the test", function () {
		expect(d.some(testObject, function (value, accessor, object) {
			return typeof value === "number" && value < 10;
		})).toBe(false);
	});
});

describe("deepFreeze", function () {
	it("should freeze all nodes and properties", function () {
		var frozenObject = d.deepFreeze(d.clone(testObjects["Multidimensional Cyclic"]));
		expect(d.every(frozenObject, function (value, accessor, object) {
			return Object.isFrozen(object) && d.isContainer(value) ? Object.isFrozen(value) : true;
		})).toBe(true);
	});
});

describe("deepSeal", function () {
	it("should seal all nodes and properties", function () {
		var sealedObject = d.deepSeal(d.clone(testObjects["Multidimensional Cyclic"]));
		expect(d.every(sealedObject, function (value, accessor, object) {
			return Object.isSealed(object) && d.isContainer(value) ? Object.isSealed(value) : true;
		})).toBe(true);
	});
});

describe("map", function () {
	it("should map all elements", function () {
		var start = [2, 4, 6, 8, 10, 12];
		var mapped = [3, 5, 7, 9, 11, 13];
		expect(diff(d.map(start, value => value + 1), mapped)).toBe(false);
	});
});

describe("nodePaths", function () {
	it("should return an array of all node/object paths", function () {
		var expectedPaths = [
			["0"],
			["1"],
			["0", "address"],
			["0", "company"],
			["1", "address"],
			["1", "company"],
			["0", "address", "geo"],
			["1", "address", "geo"]
		];
		expect(diff(d.nodePaths(testObjects["Multidimensional Acyclic"]), expectedPaths)).toBe(false);
		expectedPaths = [
			["0"],
			["1"],
			["0", "address"],
			["0", "company"],
			["1", "address"],
			["1", "company"],
			["0", "address", "geo"],
			["1", "address", "geo"],
			["0", "otherUser"],
			["1", "otherUser"]
		];
		expect(diff(d.nodePaths(testObjects["Multidimensional Cyclic"]), expectedPaths)).toBe(false);
	});
});

describe("paths", function () {
	const expectedPaths = [
		["0"],
		["1"],
		["0", "id"],
		["0", "name"],
		["0", "username"],
		["0", "email"],
		["0", "regex"],
		["0", "address"],
		["0", "website"],
		["0", "company"],
		["1", "id"],
		["1", "name"],
		["1", "username"],
		["1", "email"],
		["1", "regex"],
		["1", "address"],
		["1", "website"],
		["1", "company"],
		["0", "address", "street"],
		["0", "address", "suite"],
		["0", "address", "city"],
		["0", "address", "zipcode"],
		["0", "address", "geo"],
		["0", "company", "active"],
		["0", "company", "name"],
		["0", "company", "catchPhrase"],
		["0", "company", "bs"],
		["1", "address", "street"],
		["1", "address", "suite"],
		["1", "address", "city"],
		["1", "address", "zipcode"],
		["1", "address", "geo"],
		["1", "company", "active"],
		["1", "company", "name"],
		["1", "company", "catchPhrase"],
		["1", "company", "bs"],
		["0", "address", "geo", "lat"],
		["0", "address", "geo", "lng"],
		["1", "address", "geo", "lat"],
		["1", "address", "geo", "lng"]
	];
	it("should return an array of all node/object/primitive paths", function () {
		expect(diff(d.paths(testObjects["Multidimensional Acyclic"]), expectedPaths)).toBe(false);
	});
});

describe("findPath", function () {
	it("should return the path of the input if found", function () {
		var expectedPath = ["0", "address", "geo", "lng"];
		expect(diff(d.findPath(testObjects["Multidimensional Acyclic"], 81.1496), expectedPath)).toBe(false);
		expectedPath = ["1", "company", "name"];
		expect(diff(d.findPath(testObjects["Multidimensional Acyclic"], "Deckow-Crist"), expectedPath)).toBe(false);
	});
	it("should return null if input is not found", function () {
		expect(d.findPath(testObjects["Multidimensional Acyclic"], "This value does not exist!")).toBe(null);
	})
});

describe("findShortestPath", function () {
	it("should find the shortest path to the value", function () {
		var expectedPath = ["path2", "path22", "2"];
		expect(diff(d.findShortestPath(testObjects["Multipath"], 2), expectedPath)).toBe(false)
	});
});

describe("diffPaths", function () {
	it("should return an array of paths that differ", function () {
		var expectedPaths = [
			["0"],
			["1"],
			["0", "id"],
			["0", "name"],
			["0", "username"],
			["0", "email"],
			["0", "regex"],
			["0", "address"],
			["0", "website"],
			["0", "company"],
			["0", "otherUser"],
			["1", "id"],
			["1", "name"],
			["1", "username"],
			["1", "email"],
			["1", "regex"],
			["1", "address"],
			["1", "website"],
			["1", "company"],
			["1", "otherUser"],
			["0", "address", "street"],
			["0", "address", "suite"],
			["0", "address", "city"],
			["0", "address", "zipcode"],
			["0", "address", "geo"],
			["0", "company", "active"],
			["0", "company", "name"],
			["0", "company", "catchPhrase"],
			["0", "company", "bs"],
			["1", "address", "street"],
			["1", "address", "suite"],
			["1", "address", "city"],
			["1", "address", "zipcode"],
			["1", "address", "geo"],
			["1", "company", "active"],
			["1", "company", "name"],
			["1", "company", "catchPhrase"],
			["1", "company", "bs"],
			["0", "address", "geo", "lat"],
			["0", "address", "geo", "lng"],
			["1", "address", "geo", "lat"],
			["1", "address", "geo", "lng"]
		];
		expect(diff(differentia.diffPaths(testObjects["Multidimensional Cyclic"], testObjects["Linear Acyclic"]), expectedPaths)).toBe(false);
	});
});

describe("filter", function () {
	it("should clone values which pass the test", function () {
		var expectedObject = [
			{
				"id": 1,
				"address": {
					"zipcode": 92998,
					"geo": {
						"lat": -37.3159,
						"lng": 81.1496
					}
				}
			},
			{
				"id": 2,
				"address": {
					"zipcode": 90566,
					"geo":
						{
							"lat": -43.9509,
							"lng": -34.4618
						}
				}
			}
		];
		expect(diff(d.filter(testObjects["Multidimensional Acyclic"], value => typeof value === "number"), expectedObject)).toBe(false);
	});
	it("should return an empty array if no values pass the test", function () {
		var clone = d.filter(testObjects["Multidimensional Acyclic"], value => value === "This value does not exist!");
		expect(Array.isArray(clone) && clone.length === 0).toBe(true);
	});
});

describe("OffsetArray", function () {
	it("Should contain elements added via push", function () {
		const source = [1, 2, 3, 4, 5];
		const oa = new d.structs.OffsetArray();
		for (var number of source) {
			oa.push(number);
		}
		for (var number of source) {
			expect(oa.item(number - 1)).toEqual(number);
		}
	});
	it("Should contain elements added from an iterable", function () {
		const source = [1, 2, 3, 4, 5];
		const oa = new d.structs.OffsetArray(source);
		for (var number of source) {
			expect(oa.item(number - 1)).toEqual(number);
		}
	})
	it("Should remove and return the last element via pop", function () {
		const source = [1, 2, 3, 4, 5];
		const expected = [5, 4, 3, 2, 1];
		const oa = new d.structs.OffsetArray(source);
		for (var number of expected) {
			expect(oa.pop()).toEqual(number);
		}
	});
	it("Should remove and return the first element via shift", function () {
		const source = [1, 2, 3, 4, 5];
		const oa = new d.structs.OffsetArray(source);
		for (var number of source) {
			expect(oa.shift()).toEqual(number);
		}
	});
});

describe("LinkedList", function () {
	it("should contain elements added via push", function () {

	});
	it("should contain elements added from an iterable", function () {

	});
	it("should remove and return elements via remove", function () {

	});
	it("should remove and return the last element via pop", function () {
		
	});
	it("should remove and return elements via shift", function () {
		
	});
	it("should not add `prev` references to ListElements", function () {

	});
});

describe("CircularLinkedList", function () {
	it("should contain elements added via push", function () {

	});
	it("should contain elements added from an iterable", function () {

	});
	it("should not add `prev` references to ListElements", function () {

	});
});

describe("DoubleLinkedList", function () {
	it("should contain elements added via push", function () {

	});
	it("should contain elements added from an iterable", function () {

	});
	it("should add `prev` references to ListElements", function () {

	});
});

describe("CircularDoubleLinkedList", function () {
	it("should contain elements added via push", function () {

	});
	it("should contain elements added from an iterable", function () {

	});
	it("should add `prev` references to ListElements", function () {

	});

});

describe("BinaryTree", function () {
	it("should add elements via add", function () {
		const testTree = new d.structs.BinaryTree();
		testTree.add(50);
		testTree.add(40);
		testTree.add(60);
		testTree.add(51);
		testTree.add(41);
		testTree.add(61);
		expect(testTree.size).toBe(6);
	});
	it("should remove elements via delete", function () {
		const testTree = new d.structs.BinaryTree();
		testTree.delete(50);
		testTree.delete(40);
		testTree.delete(60);
		testTree.delete(51);
		testTree.delete(41);
		testTree.delete(61);
		expect(testTree.size).toBe(0);
	});
	it("should contain elements added from an iterable", function () {
		const testIterable = [50,40,60,51,41,61];
		const testTree = new d.structs.BinaryTree(testIterable);
		expect(testTree.size).toBe(6);
	});
	it("should order elements correctly", function () {
		//TODO
	});
	it("should traverse with bfs", function () {
		//TODO
	});
	it("should traverse with dfs", function () {
		//TODO
	});
});

describe("RedBlackTree", function () {
	//TODO
});

