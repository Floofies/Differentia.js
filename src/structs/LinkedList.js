/**
 * LinkedList - Linear Acyclic Linked List
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new LinkedList.
 */
structs.LinkedList = function (iterable = null) {
	this.tail = new this.ListElement(null, null);
	this.tail.parent = this;
	this.head = new this.ListElement(null, this.tail);
	this.head.parent = this;
	this.double = false;
	this.circular = false;
	this.size = 0;
	if (iterable !== null) {
		this.fromIterable(iterable);
	}
};
structs.LinkedList.prototype[Symbol.iterator] = function* () {
	var curElement = this.head;
	var nextElement;
	while (curElement !== null && this.size > 0) {
		nextElement = curElement.next;
		if (curElement !== this.head && curElement !== this.tail) {
			continue;
		}
		yield curElement;
		curElement = nextElement;
	}
};
structs.LinkedList.prototype.values = structs.LinkedList.prototype[Symbol.iterator];
/**
 * ListElement - LinkedList Element
 * @param {any} payload      Optional data payload for the element.
 * @param {any} [next=null]  The next element in the LinkedList.
 * @param {any} [prev=null]  The previous element in the LinkedList.
 */
structs.LinkedList.prototype.ListElement = function (payload = null, next = null, prev = null) {
	this.payload = payload;
	this.parent = null;
	this.next = next;
	this.prev = prev;
};
/**
 * fromElement - Copies the payload of a ListElement into the callee ListElement.
 * @param {ListElement} element  A ListElement to copy the payload from.
 */
structs.LinkedList.prototype.ListElement.prototype.fromElement = function (element) {
	this.payload = element.payload;
};
/**
 * coerceElement - Creates a new ListElement using `value` if `value` it is not already a ListElement.
 * @param {any} value  A ListElement, or a value to create a new ListElement with.
 * @returns {ListElement}  The new ListElement, or `value` if it is already a ListElement.
 */
structs.LinkedList.prototype.coerceElement = function (value) {
	return (value instanceof this.ListElement ? value : new this.ListElement(value));
};
/**
 * get - Returns the first ListElement encountered that contains a payload matching `value`. Returns `null` if one was not found.
 * @param {any} value  A value to search for in the LinkedList.
 * @returns {(ListElement|null)}  The found ListElement, or `null` if it was not found.
 */
structs.LinkedList.prototype.get = function (value) {
	for (var element of this.values()) {
		if (element.payload === value) {
			return element;
		}
		if (element.next === this.tail) {
			return null;
		}
	}
};
/**
 * clear - Removes all elements from the LinkedList.
 */
structs.LinkedList.prototype.clear = function () {
	if (this.size > 0) {
		for (var element of this.values()) {
			if (element !== this.head) {
				this.remove(element);
			}
			if (element === this.tail) {
				this.size = 0;
				break;
			}
		}
	}
};
/**
 * fromIterable - Populates the LinkedList from an iterable.
 * @param {Iterable} iterable  The iterable to populate the LinkedList with.
 */
structs.LinkedList.prototype.fromIterable = function (iterable) {
	assert.argType(iterable !== null && Symbol.iterator in iterable, "iterable", 1);
	const thisIterator = this.values();
	var curState;
	for (var value of iterable[Symbol.iterator]()) {
		curState = thisIterator.next();
		if (curState.done) {
			return;
		}
		this.insertAfter(curState.value, value);
	}
};
/**
 * fromIterable - Concatenates multiple LinkedLists into the callee LinkedList.
 * @param {Array} joinLists  An argument list of LinkedLists to concatenate.
 */
structs.LinkedList.prototype.concat = function (...joinLists) {
	joinLists.forEach(function (list) {
		for (var element of list.values()) {
			if (element !== list.head && element !== list.tail) {
				this.append((new this.ListElement()).fromElement(element));
			}
		}
	});
};
/**
 * remove - Removes an element from the LinkedList.
 * @param {ListElement} element  A ListElement object to remove from the LinkedList.
 * @returns {ListElement}        The removed ListElement.
 */
structs.LinkedList.prototype.remove = function (element) {
	assert.argType(element instanceof this.ListElement, "ListElement", 1);
	if (element.parent !== this) {
		return null;
	}
	var found = false;
	if (this.double && element.parent === this) {
		found = true;
		element.prev.next = element.next;
		element.next.prev = element.prev;
	} else {
		for (var node of this[Symbol.iterator]()) {
			if (node.next === element) {
				foundElement = true;
				node.next = element.next;
			}
		}
	}
	if (!foundElement) {
		return null;
	}
	element.parent = null;
	element.next = null;
	element.prev = null;
	this.size--;
	return element;
};
/**
 * insertBefore - Inserts a new node containing `value` before `element`
 * @param {ListElement} element     A ListElement object to prepend with newElement.
 * @param {(ListElement|any)} newElement  A ListElement object to add to the LinkedList before `element`.
 */
structs.LinkedList.prototype.insertBefore = function (element, newElement) {
	assert.argType(element instanceof this.ListElement, "ListElement", 1);
	if (element.parent !== this) {
		return null;
	}
	newElement = this.coerceElement(newElement);
	if (this.double) {
		newElement.next = element;
		newElement.prev = element.prev;
		element.prev.next = newElement;
		element.prev = newElement;
	} else {
		var lastElement = null;
		var foundElement = false;
		for (var curElement of this[Symbol.iterator]()) {
			if (curElement === element) {
				foundElement = true;
				if (lastElement !== null) {
					lastNode.next = newElement;
				}
				newElement.next = curElement;
				break;
			}
			if (curElement.next === this.tail) {
				break;
			}
			lastElement = node;
		}
	}
	if (!foundElement) {
		return null;
	}
	this.size++;
	return foundElement;
};
/**
 * insertAfter - Inserts a new node containing `value` after `element`
 * @param {ListElement} element     A ListElement object to append with newElement.
 * @param {ListElement} newElement  A ListElement object to add to the LinkedList after `element`.
 */
structs.LinkedList.prototype.insertAfter = function (element, newElement) {
	assert.argType(element instanceof this.ListElement, "ListElement", 1);
	if (element.parent !== this) {
		return null;
	}
	newElement = this.coerceElement(newElement);
	newElement.next = element.next;
	if (this.double) {
		newElement.prev = element;
	}
	element.next = newElement;
	this.size++;
	return newElement;
};
/**
 * prepend - Inserts a ListElement at the beginning of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to add to the beginning of the LinkedList.
 */
structs.LinkedList.prototype.prepend = function (newElement) {
	return this.insertAfter(this.head, newElement);
};
/**
 * prepend - Inserts a ListElement at the end of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to add to the end of the LinkedList.
 */
structs.LinkedList.prototype.append = function (newElement) {
	return this.insertBefore(this.tail, newElement);
};
/**
 * push - Inserts a ListElement at the end of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to add to the end of the LinkedList.
 */
structs.LinkedList.prototype.push = structs.LinkedList.prototype.append;
/**
 * unshift - Inserts a ListElement at the beginning of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to add to the beginning of the LinkedList.
 */
structs.LinkedList.prototype.unshift = structs.LinkedList.prototype.prepend;
/**
 * remove - Removes an element from the beginning of the LinkedList and returns it.
 * @returns {ListElement}        The removed ListElement.
 */
structs.LinkedList.prototype.shift = function () {
	return this.remove(this.head.next);
};
/**
 * pushBack - Moves a ListElement to the end of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to move to the end of the LinkedList.
 */
structs.LinkedList.prototype.pushBack = function (element) {
	this.remove(element);
	this.append(element);
};
/**
 * CircularLinkedList - A Cyclic LinkedList with connected head and tail elements.
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new CircularLinkedList.
 */
structs.CircularLinkedList = function (iterable = null) {
	this.tail = new this.ListElement(null);
	this.tail.parent = this;
	this.head = new this.ListElement(null, this.tail);
	this.head.parent = this;
	this.tail.next = this.head;
	this.double = false;
	this.circular = true;
	this.fromIterable(iterable);
};
structs.CircularLinkedList.prototype = structs.LinkedList.prototype;
/**
 * DoubleLinkedList - A Doubly Linked Acyclic LinkedList with elements that have `prev` links.
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new DoubleLinkedList.
 */
structs.DoubleLinkedList = function (iterable = null) {
	this.tail = new this.ListElement(null, null);
	this.tail.parent = this;
	this.head = new this.ListElement(null, this.tail);
	this.head.parent = this;
	this.tail.prev = this.head;
	this.double = true;
	this.circular = false;
	this.fromIterable(iterable);
};
structs.DoubleLinkedList.prototype = structs.LinkedList.prototype;
/**
 * CircularDoubleLinkedList - A Doubly Linked Cyclic LinkedList with elements that have `prev` links, and connected head and tail elements.
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new CircularDoubleLinkedList.
 */
structs.CircularDoubleLinkedList = function (iterable = null) {
	this.tail = new this.ListElement(null, null);
	this.tail.parent = this;
	this.head = new this.ListElement(null, this.tail, this.tail);
	this.head.parent = this;
	this.tail.next = this.head;
	this.tail.prev = this.head;
	this.double = true;
	this.circular = true;
	this.fromIterable(iterable);
};
structs.CircularDoubleLinkedList.prototype = structs.LinkedList.prototype;