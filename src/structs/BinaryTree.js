structs.BinaryTree = function (iterable = null) {
	this.root = null;
	this.smallestElement = null;
	this.largestElement = null;
	this.height = 0;
	this.rightHeight = 0;
	this.leftHeight = 0;
	this.size = 0;
	if (iterable !== null && Symbol.iterator in iterable) {
		this.fromIterable(iterable);
	}
};
structs.BinaryTree.prototype.TreeElement = function (payload = null, parent = null, left = null, right = null) {
	this.payload = payload;
	if ((typeof payload) === "number") {
		this.weight = payload;
	} else {
		this.weight = 0;
	}
	this.parent = parent;
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
structs.BinaryTree.prototype.fromIterable = function (iterable) {
	for (var value of iterable[Symbol.iterator]()) {
		this.add(value);
	}
};
structs.BinaryTree.prototype[Symbol.iterator] = function* (bfs = false, startElement = null) {
	const targets = [startElement !== null ? startElement : this.root];
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
structs.BinaryTree.prototype.bfs = function (startElement = null) {
	return this[Symbol.iterator](true, startElement);
};
structs.BinaryTree.prototype.dfs = function (startElement = null) {
	return this[Symbol.iterator](false, startElement);
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
structs.BinaryTree.prototype.findClosestWeight = function (findWeight, startElement = null) {
	if (this.size === 0) {
		return null;
	}
	var element = startElement !== null ? startElement : this.root;
	while (true) {
		if (findWeight === element.weight || element.left === null && element.right === null) {
			return element;
		}
		if (findWeight > element.weight && element.right !== null) {
			element = element.right;
			continue;
		} else if (findWeight < element.weight && element.left !== null) {
			element = element.left;
			continue;
		}
		return element;
	}
};
structs.BinaryTree.prototype.findLargestWeight = function (startElement = null) {
	return this.findClosestWeight(Infinity, startElement);
};
structs.BinaryTree.prototype.findSmallestWeight = function (startElement = null) {
	return this.findClosestWeight(0, startElement);
};
structs.BinaryTree.prototype.findWeight = function (weight, startElement = null) {
	const foundElement = this.findClosestWeight(weight, startElement);
	if (foundElement !== null && foundElement.weight === weight) {
		return foundElement;
	}
	return null;
};
structs.BinaryTree.prototype.findValue = function (value, startElement = null) {
	for (var element of this.dfs(startElement)) {
		if (value === element.payload) {
			return element;
		}
	}
	return null;
};
structs.BinaryTree.prototype.hasValue = function (value) {
	return this.findValue(value) !== null;
};
structs.BinaryTree.prototype.hasWeight = function (weight) {
	return this.findWeight(value) !== null;
};
structs.BinaryTree.prototype.add = function (element) {
	element = this.coerceElement(element);
	if (this.root === null) {
		this.root = element;
		this.smallestElement = element;
		this.largestElement = element;
		this.height++;
	} else {
		const closestElement = this.findClosestWeight(element.weight);
		element.parent = closestElement;
		if (element.weight >= closestElement.weight) {
			closestElement.right = element;
		} else {
			closestElement.left = element;
		}
		if (closestElement === this.largestElement) {
			this.rightHeight++;
			this.height++;
		} else if (closestElement === this.smallestElement) {
			this.leftHeight++;
			this.height++;
		}
		if (element.weight > this.largestElement.weight) {
			this.largestElement = element;
		}
		if (element.weight < this.smallestElement.weight) {
			this.smallestElement = element;
		}
	}
	this.size++;
};
structs.BinaryTree.prototype.delete = function (element) {
	if (this.root === null) {
		return null;
	}
	if ((typeof element) === "number") {
		element = this.findClosestWeight(element);
	}
	if (this.size <= 1 && element === this.root) {
		this.root = null;
		return element;
	}
	if (element.left !== null && element.right !== null) {
		var successor = this.findLargestWeight(element.left);
		element.payload = successor.payload;
		element.weight = successor.weight;
		this.delete(successor);
	} else if (element.left !== null) {
		if (element.parent.left === element) {
			element.parent.left = element.left;
		} else if (element.parent.right === element) {
			element.parent.right = element.left;
		}
	} else if (element.right !== null) {
		if (element.parent.left === element) {
			element.parent.left = element.right;
		} else if (element.parent.right === element) {
			element.parent.right = element.right;
		}
	} else {
		if (element.parent.left === element) {
			element.parent.left = null;
		} else if (element.parent.right === element) {
			element.parent.right = null;
		}
	}
	return element;
};
structs.BinaryTree.prototype.rotate = function (element, direction) {
	var dir = direction ? "left" : "right";
	var oppDir = direction ? "right" : "left";
	const pivot = element[dir];
	element[dir] = pivot[oppDir];
	if (element[dir] !== null) {
		element[dir].parent = element;
	}
	pivot.parent = element.parent;
	if (element.parent === null) {
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
structs.RedBlackTree.prototype = Object.create(structs.BinaryTree.prototype);
structs.RedBlackTree.prototype.TreeElement = function (...args) {
	structs.BinaryTree.prototype.TreeElement.apply(this, args);
	this.red = true;
};
structs.RedBlackTree.prototype.swapColor = function (element1, element2) {
	const color1 = element1.red;
	const color2 = element2.red;
	element1.red = color2;
	element2.red = color1;
};
structs.RedBlackTree.prototype.validate = function (callbacks) {
	if (this.root === null) {
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
structs.RedBlackTree.prototype.balance = function (element) {
	if (this.size <= 1) {
		return;
	}
	while (element !== this.root && !element.red && element.parent.color.red) {
		var parent = element.parent;
		var grandParent = element.parent.parent;
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
structs.RedBlackTree.prototype.add = function (element) {
	element = this.coerceElement(element);
	structs.BinaryTree.prototype.add.call(this, element);
	if (this.size > 1 && element.parent.red) {
		element.red = false;
	} else {
		element.red = true;
	}
	this.balance(element);
};
structs.RedBlackTree.prototype.delete = function (element) {
	structs.BinaryTree.prototype.delete.call(this, element);
};
structs.RedBlackTree.prototype.clear = function () {
	this.constructor();
};