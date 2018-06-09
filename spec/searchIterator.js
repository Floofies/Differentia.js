var d = global.d;

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
		var keyCounts = global.createKeyCounter();
		var testObject = global.testObjects["Multidimensional Cyclic"]();
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
		var keyCounts = global.createKeyCounter();
		var testObject = global.testObjects["Multidimensional Cyclic"]();
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