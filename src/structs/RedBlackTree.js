const BinaryTree = require("./structs/BinaryTree");
function RedBlackTree() {
	BinaryTree.call(this);
};
RedBlackTree.prototype = Object.create(BinaryTree.prototype);
RedBlackTree.prototype.TreeElement = function (...args) {
	BinaryTree.prototype.TreeElement.apply(this, args);
	this.red = true;
};
RedBlackTree.prototype.swapColor = function (element1, element2) {
	const color1 = element1.red;
	const color2 = element2.red;
	element1.red = color2;
	element2.red = color1;
};
RedBlackTree.prototype.validate = function (callbacks) {
	if (this.root === null) {
		return true;
	}
	for (var element of this.bfs()) {
		if (this.root.red && (element.left.red || element.right.red)) {
			return false;
		}
		if ((element.left !== null && element.weight >= this.root.weight)
			|| (element.right !== null && element.weight <= this.root.weight)) {
			return false;
		}
	}
	return true;
};
RedBlackTree.prototype.balance = function (element) {
	if (this.size <= 1) {
		return;
	}
	while (element !== this.root && !element.red && element.parent.red) {
		var parent = element.parent;
		var grandParent = element.parent.parent;
		if (grandParent === null) {
			return;
		}
		const dir = parent === grandParent.left ? "right" : "left";
		const oppDir = dir === "right" ? "left" : "right";
		if (grandParent[dir] !== null && grandParent[dir].red) {
			grandParent.red = true;
			parent.red = false;
			grandParent[dir].red = false;
			element = element.parent;
		} else {
			if (element === parent[dir]) {
				this["rotate" + oppDir](parent);
			}
			this["rotate" + dir](grandParent);
			this.swapColor(parent, grandParent);
			element = parent;
		}
	}
	this.root.red = true;
};
RedBlackTree.prototype.add = function (element) {
	element = this.coerceElement(element);
	BinaryTree.prototype.add.call(this, element);
	if (this.size > 1 && element.parent.red) {
		element.red = false;
	} else {
		element.red = true;
	}
	this.balance(element);
};
RedBlackTree.prototype.delete = function (element) {
	const newRoot = BinaryTree.prototype.delete.call(this, element);
	if (newRoot !== null) {
		this.balance(newRoot);
	}
	return newRoot;
};
module.exports = RedBlackTree;