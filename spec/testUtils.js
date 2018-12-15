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
const testObjects = {};
testObjects["Multidimensional Acyclic"] = () => createTestObject();
testObjects["Linear Acyclic"] = () => ["one", "two", "three"];
// Fourth element is a cycle
testObjects["Linear Cyclic"] = () => {
	const obj = ["one", "two", "three"];
	obj[3] = obj;
	return obj;
};
// Nested Arrays
testObjects["Nested Acyclic"] = () => ["one", "two", [
	"three", "four", [
		"five", "six"
	]
]];
testObjects["Nested Cyclic"] = () => {
	const obj = ["one", "two", [
		"three", "four", [
			"five", "six"
		]
	]];
	obj[2].push(obj[2][2]);
	return obj;
};
// `otherUser` properties are a cycle
testObjects["Multidimensional Cyclic"] = () => {
	const obj = createTestObject();
	obj[0].otherUser = obj[1];
	obj[1].otherUser = obj[0];
	return obj;
}
// Useful for mapping shortest path
testObjects["Multipath"] = () => ({
	path1: {
		path12: {
			path13: [0, 1, 2, 3, 4]
		}
	},
	path2: {
		path22: [0, 1, 2, 3, 4]
	}
});
// Useful for mapping multiple paths to the same value
testObjects["Multireference"] = () => {
	const obj = {
		path1: {
			path12: {
				path13: [0, 1, 2, 3, 4]
			}
		},
		path2: {
			path22: "Hello!"
		}
	}
	obj.path1.path12.path13[5] = obj.path2.path22;
	return obj;
};

function createKeyCounter() {
	var testObject = testObjects["Multidimensional Cyclic"]();
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

function testDiff(subject, compare, search = null) {
	const noIndex = search === null;
	if (noIndex && testLength(subject) !== testLength(compare)) return true;
	if (noIndex) search = subject;
	const tuple = { subject, search, compare };
	const map = new Map();
	map.set(search, tuple);
	if (testDiff.test(tuple, map, noIndex)) return true;
	return false;
}

// Checks for which "newer" RegExp properties are supported.
const supportedRegExpProps = {
	sticky: "sticky" in RegExp.prototype,
	unicode: "unicode" in RegExp.prototype,
	flags: "flags" in RegExp.prototype
};

testDiff.test = function (tuple, map, noIndex) {
	for (const accessor in tuple.search) {
		if (!(accessor in tuple.subject)) continue;
		if (!("compare" in tuple) && !(typeof tuple.compare !== "object") || !(accessor in tuple.compare)) {
			return true;
		}
		const subjectProp = tuple.subject[accessor];
		const compareProp = tuple.compare[accessor];
		const searchProp = tuple.search[accessor];
		if ((Array.isArray(subjectProp) && Array.isArray(compareProp))
			|| ((typeof subjectProp === "object" && typeof compareProp === "object")
				&& (subjectProp !== null && compareProp !== null))) {
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
			if (map.has(searchProp)) continue;
			// Node has not been seen before, so traverse it
			const nextTuple = {};
			// Travese the Tuple's properties
			for (const unit in tuple) {
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
			if (testDiff.test(nextTuple, map, noIndex)) return true;
		} else {
			if (Number.isNaN(subjectProp) !== Number.isNaN(compareProp)) return true;
			if (subjectProp !== compareProp) return true;
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
		expect(testDiff(testObjects["Linear Acyclic"](), testObjects["Linear Cyclic"]())).toBe(true);
		expect(testDiff(testObjects["Multidimensional Cyclic"](), testObjects["Multidimensional Acyclic"]())).toBe(true);
		expect(testDiff(testObjects["Linear Cyclic"](), testObjects["Multidimensional Acyclic"]())).toBe(true);
		expect(testDiff(testObjects["Nested Cyclic"](), testObjects["Nested Acyclic"]())).toBe(true);
	});
	it("should return false when two objects are the same", function () {
		expect(testDiff(testObjects["Linear Acyclic"](), testObjects["Linear Acyclic"]())).toBe(false);
		expect(testDiff(testObjects["Linear Cyclic"](), testObjects["Linear Cyclic"]())).toBe(false);
		expect(testDiff(testObjects["Multidimensional Acyclic"](), testObjects["Multidimensional Acyclic"]())).toBe(false);
		expect(testDiff(testObjects["Multidimensional Cyclic"](), testObjects["Multidimensional Cyclic"]())).toBe(false);
		expect(testDiff(testObjects["Nested Cyclic"](), testObjects["Nested Cyclic"]())).toBe(false);
		expect(testDiff(testObjects["Nested Acyclic"](), testObjects["Nested Acyclic"]())).toBe(false);
	});
});

Object.assign(global, {
	createTestObject,
	testObjects,
	createKeyCounter,
	testLength,
	testDiff,
	supportedRegExpProps
});