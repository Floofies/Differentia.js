var d = global.d;

describe("forEach", function () {
	it("should iterate all nodes and properties", function () {
		var keyCounts = global.createKeyCounter();
		var testObject = global.testObjects["Multidimensional Cyclic"]();
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
		expect(d.diff(global.testObjects["Linear Acyclic"](), global.testObjects["Linear Cyclic"]())).toBe(true);
		expect(d.diff(global.testObjects["Multidimensional Cyclic"](), global.testObjects["Multidimensional Acyclic"]())).toBe(true);
		expect(d.diff(global.testObjects["Linear Cyclic"](), global.testObjects["Multidimensional Acyclic"]())).toBe(true);
	});
	it("should return false when two objects are the same", function () {
		expect(d.diff(global.testObjects["Linear Acyclic"](), global.testObjects["Linear Acyclic"]())).toBe(false);
		expect(d.diff(global.testObjects["Linear Cyclic"](), global.testObjects["Linear Cyclic"]())).toBe(false);
		expect(d.diff(global.testObjects["Multidimensional Acyclic"](), global.testObjects["Multidimensional Acyclic"]())).toBe(false);
		expect(d.diff(global.testObjects["Multidimensional Cyclic"](), global.testObjects["Multidimensional Cyclic"]())).toBe(false);
	});
	it("should return true when two objects differ using the search index", function () {
		expect(d.diff(global.testObjects["Linear Acyclic"](), global.testObjects["Linear Cyclic"](), { 3: null })).toBe(true);
	});
	it("should return false when two objects are the same using the search index", function () {
		expect(d.diff(global.testObjects["Linear Acyclic"](), global.testObjects["Linear Cyclic"](), { 1: null })).toBe(false);
	});
});

describe("clone", function () {
	it("should make an exact copy of the subject", function () {
		var clone = d.clone(global.testObjects["Linear Acyclic"]());
		expect(global.testDiff(clone, global.testObjects["Linear Acyclic"]())).toBe(false);
		clone = d.clone(global.testObjects["Linear Cyclic"]());
		expect(global.testDiff(clone, global.testObjects["Linear Cyclic"]())).toBe(false);
		clone = d.clone(global.testObjects["Multidimensional Cyclic"]());
		expect(global.testDiff(clone, global.testObjects["Multidimensional Cyclic"]())).toBe(false);
	});
	it("should clone properties using the search index", function () {
		var clone = d.clone(global.testObjects["Linear Acyclic"](), { 2: null });
		var search = { 2: Number };
		expect(global.testDiff(clone, global.testObjects["Linear Acyclic"](), search)).toBe(false);
		search = [{
			address: {
				geo: {
					lat: null
				}
			}
		}];
		clone = d.clone(global.testObjects["Multidimensional Cyclic"](), search);
		expect(global.testDiff(clone, global.testObjects["Multidimensional Cyclic"](), search)).toBe(false);
	});
});

describe("diffClone", function () {
	var subject = { "hello": "world", "how": "are you?", "have a": "good day" };
	var compare = { "hello": "world", "whats": "up?", "have a": "good night" };
	it("should clone properties that differ", function () {
		var clone = d.diffClone(subject, compare);
		expect(global.testDiff(clone, { "how": "are you?", "have a": "good day" })).toBe(false);
	});
	it("should clone properties that differ using the search index", function () {
		var clone = d.diffClone(subject, compare, { "how": null });
		expect(global.testDiff(clone, { "how": "are you?" })).toBe(false);
	});
});

describe("find", function () {
	it("should return a value if it passes the test", function () {
		expect(d.find(global.testObjects["Multidimensional Cyclic"](), function (value, accessor, object) {
			return value === -37.3159;
		})).toBe(-37.3159);
	});
	it("should return undefined if no values pass the test", function () {
		expect(d.find(global.testObjects["Multidimensional Cyclic"](), function (value, accessor, object) {
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
		var frozenObject = d.deepFreeze(d.clone(global.testObjects["Multidimensional Cyclic"]()));
		expect(d.every(frozenObject, function (value, accessor, object) {
			return Object.isFrozen(object) && d.utils.isContainer(value) ? Object.isFrozen(value) : true;
		})).toBe(true);
	});
});

describe("deepSeal", function () {
	it("should seal all nodes and properties", function () {
		var sealedObject = d.deepSeal(d.clone(global.testObjects["Multidimensional Cyclic"]()));
		expect(d.every(sealedObject, function (value, accessor, object) {
			return Object.isSealed(object) && d.utils.isContainer(value) ? Object.isSealed(value) : true;
		})).toBe(true);
	});
});

describe("map", function () {
	it("should map all elements", function () {
		var start = [2, 4, 6, 8, 10, 12];
		var mapped = [3, 5, 7, 9, 11, 13];
		expect(global.testDiff(d.map(start, value => value + 1), mapped)).toBe(false);
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
		expect(global.testDiff(d.nodePaths(global.testObjects["Multidimensional Acyclic"]()), expectedPaths)).toBe(false);
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
		expect(global.testDiff(d.nodePaths(global.testObjects["Multidimensional Cyclic"]()), expectedPaths)).toBe(false);
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
		expect(global.testDiff(d.paths(global.testObjects["Multidimensional Acyclic"]()), expectedPaths)).toBe(false);
	});
});

describe("findPath", function () {
	it("should return the first found path to the input if one is found", function () {
		var expectedPath = ["0", "address", "geo", "lng"];
		expect(global.testDiff(d.findPath(global.testObjects["Multidimensional Acyclic"](), 81.1496), expectedPath)).toBe(false);
		expectedPath = ["1", "company", "name"];
		expect(global.testDiff(d.findPath(global.testObjects["Multidimensional Acyclic"](), "Deckow-Crist"), expectedPath)).toBe(false);
	});
	it("should return null if a path to the input is not found", function () {
		expect(d.findPath(global.testObjects["Multidimensional Acyclic"](), "This value does not exist!")).toBe(null);
	})
});

describe("findPaths", function () {
	it("should return the all paths to the input if any are found", function () {
		var expectedPaths = [
			["path2", "path22"],
			["path1", "path12", "path13", "5"]
		];
		expect(global.testDiff(d.findPaths(global.testObjects["Multireference"](), "Hello!"), expectedPaths)).toBe(false);
		expectedPaths = [
			["0", "website"],
			["1", "website"]
		];
		expect(global.testDiff(d.findPaths(global.testObjects["Multidimensional Cyclic"](), null), expectedPaths)).toBe(false);
	});
	it("should return null if a path to the input is not found", function () {
		expect(d.findPaths(global.testObjects["Multidimensional Acyclic"](), "This value does not exist!")).toBe(null);
	})
});

describe("findShortestPath", function () {
	it("should find the shortest path to the value", function () {
		var expectedPath = ["path2", "path22", "2"];
		expect(global.testDiff(d.findShortestPath(global.testObjects["Multipath"](), 2), expectedPath)).toBe(false)
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
		expect(global.testDiff(d.diffPaths(global.testObjects["Multidimensional Cyclic"](), global.testObjects["Linear Acyclic"]()), expectedPaths)).toBe(false);
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
		expect(global.testDiff(d.filter(global.testObjects["Multidimensional Acyclic"](), value => typeof value === "number"), expectedObject)).toBe(false);
	});
	it("should return an empty array if no values pass the test", function () {
		var clone = d.filter(global.testObjects["Multidimensional Acyclic"](), value => value === "This value does not exist!");
		expect(Array.isArray(clone) && clone.length === 0).toBe(true);
	});
});