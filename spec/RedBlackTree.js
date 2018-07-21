var d = global.d;

describe('RedBlackTree', function() {

  it('should add elements via add', function() {
    const testTree = new d.structs.RedBlackTree();
    testTree.add(50);
		testTree.add(40);
		testTree.add(60);
		testTree.add(51);
		testTree.add(41);
		testTree.add(61);
		expect(testTree.size).toBe(6);
  });

  it("should remove elements via delete", function() {
		const testTree = new d.structs.RedBlackTree();
		testTree.delete(50);
		testTree.delete(40);
		testTree.delete(60);
		testTree.delete(51);
		testTree.delete(41);
		testTree.delete(61);
		expect(testTree.size).toBe(0);
	});

  it("should return true when validating null", function() {
    const testTree = new d.structs.RedBlackTree();
    expect(testTree.validate(null)).toBe(true);
  });

  
});
