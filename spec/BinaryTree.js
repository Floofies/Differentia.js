var d = global.d;

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
