structs.BinaryTree = function () {
	this.root = null;
	this.leftMost = null;
	this.rightMost = null;
	this.size = 0;
	this.height = 0;
};
structs.BinaryTree.prototype.TreeElement = function (payload = null, prev = null, left = null, right = null) {
	this.payload = payload;
	this.prev = prev;
	this.left = left;
	this.right = right;
};
/**
 * coerceElement - Creates a new TreeElement using `value` if `value` it is not already a TreeElement.
 * @param {any} value  A TreeElement, or a value to create a new TreeElement with.
 * @returns {TreeElement}  The new TreeElement, or `value` if it is already a TreeElement.
 */
structs.BinaryTree.prototype.coerceElement = function (value) {
	return (value instanceof this.TreeElement ? value : new this.TreeElement(value));
};
structs.BinaryTree.prototype[Symbol.iterator] = function* (bfs = false) {
	const targets = [this.root];
	var getMethod = bfs ? "shift" : "pop";
	var element;
	while (this.size > 0 && targets.length > 0) {
		element = targets[getMethod]();
		yield element;
		if (element.right !== null) {
			targets.push(element.right);
		}
		if (element.left !== null) {
			targets.push(element.left);
		}
	}
};
structs.BinaryTree.prototype.bfs = function () {
	return this[Symbol.iterator](true);
};
structs.BinaryTree.prototype.dfs = function () {
	return this[Symbol.iterator](false);
};
structs.BinaryTree.values = function* () {
	for (var element in this[Symbol.iterator]()) {
		yield element.payload;
	}
};
structs.BinaryTree.prototype.forEach = function (func) {
	for (var element of this[Symbol.iterator]()) {
		func(element);
	}
};
structs.BinaryTree.prototype.findClosestWeight = function (findWeight) {
	var element = this.root;
	while (true) {
		if (findWeight === element.weight || element.left === null && element.right === null) {
			return element;
		}
		if (findWeight > element.weight) {
			if (element.right !== null) {
				element = element.right;
			}
		} else if (findWeight < element.weight) {
			if (element.left !== null) {
				element = element.left;
			}
		}
	}
};
structs.BinaryTree.prototype.findWeight = function (weight) {
	const foundElement = this.findClosestWeight(weight);
	if (foundElement !== null && foundElement.weight === weight) {
		return foundElement;
	}
	return null;
};
structs.BinaryTree.prototype.findValue = function (value) {
	for (var element of this[Symbol.iterator]()) {
		if (value === element.payload) {
			return element;
		}
	}
};
structs.BinaryTree.prototype.hasValue = function (value) {
	return this.findValue(value) !== null;
};
structs.BinaryTree.prototype.hasWeight = function (weight) {
	return this.findWeight(value) !== null;
};
structs.BinaryTree.prototype.add = function (element) {
	element = this.coerceElement(element);
	if (this.root = null) {
		this.root = element;
	} else {
		const closestElement = this.findClosestWeight(element.weight);
		element.prev = closestElement;
		if (element.weight >= closestElement) {
			closestElement.right = element;
		} else {
			closestElement.left = element;
		}
	}
};
structs.BinaryTree.prototype.rotate = function (element, direction) {
	dir = direction ? "left" : "right";
	oppDir = direction ? "right" : "left";
	const pivot = element[dir];
	element[dir] = pivot[oppDir];
	if (element[dir] !== null) {
		element[dir].parent = element;
	}
	pivot.parent = element.parent;
	if (element.parent !== null) {
		this.root = pivot;
		this.root.red = false;
	} else if (element === element.parent.left) {
		element.parent.left = pivot;
	} else {
		element.parent.right = pivot;
	}
	pivot[dir] = element;
	element.parent = pivot;
};
structs.BinaryTree.prototype.rotateRight = function (element) {
	this.rotate(element, true);
};
structs.BinaryTree.prototype.rotateLeft = function (element) {
	this.rotate(element, false);
};
structs.RedBlackTree = function () {
	structs.BinaryTree.call(this);
	this.leftBlackHeight = 0;
	this.rightBlackHeight = 0;
};
structs.RedBlackTree.prototype = Object.create(structs.LinkedList.prototype);
structs.RedBlackTree.prototype.swapColor = function (element1, element2) {
	const color1 = element1.red;
	const color2 = element2.red;
	element1.red = color2;
	element2.red = color1;
};
structs.RedBlackTree.prototype.validate = function (callbacks) {
	if (this.size === 0) {
		return true;
	}
	if (this.leftBlackHeight !== this.rightBlackHeight) {
		return false;
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
structs.RedBlackTree.prototype.balance = function () {
	for (var element of this.bfs()) {
		const dir = element.parent === element.parent.parent.left ? "right" : "left";
		const oppDir = dir === "right" ? "left" : "right";
		if (element.parent.parent[dir] !== null && element.parent.parent[dir].red) {
			element.parent.parent.red = true;
			element.parent.red = false;
			element.parent.parent[dir].red = false;
		} else {
			if (element === element.parent[dir]) {
				this["rotate" + oppDir](element.parent);
			}
			this["rotate" + dir](element.parent.parent);
			this.swapColor(element.parent, element.parent.parent);
		}
	}
};
structs.RedBlackTree.prototype.add = function (element) {
	element = this.coerceElement(element);
	structs.BinaryTree.prototype.add.call(this, element);
	if (this.size > 1 && element.parent.red) {
		element.red = false;
		if (element.weight >= this.root) {
			this.rightBlackHeight++;
		} else if (element.weight < this.root) {
			this.leftBlackHeight++;
		}
	} else {
		element.red = true;
	}
	this.balance();
};
structs.RedBlackTree.prototype.delete = function (element) {
	//TODO
	return element;
};
structs.RedBlackTree.prototype.clear = this.constructor;