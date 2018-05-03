/**
 * LinkedList - Linear Acyclic Linked List
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new LinkedList.
 */
function LinkedList(iterable = null) {
	this.tail = new this.ListElement(null, null);
	this.tail.parent = this;
	this.head = new this.ListElement(null, this.tail);
	this.head.parent = this;
	this.double = false;
	this.circular = false;
	this.size = 0;
	this.fromIterable(iterable);
};
LinkedList.prototype[Symbol.iterator] = function* (ends = false) {
	var curElement = ends ? this.head : this.head.next;
	var nextElement;
	while (curElement !== null) {
		if (!ends && curElement === this.tail) break;
		nextElement = curElement.next;
		yield curElement;
		curElement = nextElement;
	}
};
LinkedList.prototype[Symbol.toStringTag] = "LinkedList";
/**
 * ListElement - LinkedList Element
 * @param {any} payload      Optional data payload for the element.
 * @param {any} [next=null]  The next element in the LinkedList.
 * @param {any} [prev=null]  The previous element in the LinkedList.
 */
LinkedList.prototype.ListElement = function (payload = null, next = null, prev = null) {
	this.payload = payload;
	this.parent = null;
	this.next = next;
	this.prev = prev;
};
// Adds ListElement to the LinkedList constructor for convenience.
LinkedList.ListElement = LinkedList.prototype.ListElement;
/**
 * fromElement - Copies the payload of a ListElement into the callee ListElement.
 * @param {ListElement} element  A ListElement to copy the payload from.
 */
LinkedList.prototype.ListElement.prototype.fromElement = function (element) {
	this.payload = element.payload;
};
/**
 * coerceElement - Creates a new ListElement using `value` if `value` it is not already a ListElement.
 * @param {any} value      A ListElement, or a value to create a new ListElement with.
 * @returns {ListElement}  The new ListElement, or `value` if it is already a ListElement.
 */
LinkedList.prototype.coerceElement = function (value) {
	return (value instanceof this.ListElement ? value : new this.ListElement(value));
};
/**
 * fromIterable - Populates the LinkedList from an iterable.
 * @param {Iterable} iterable  The iterable to populate the LinkedList with.
 */
LinkedList.prototype.fromIterable = function (iterable) {
	if (iterable === null) return;
	assert.argType((typeof iterable === "object") && Symbol.iterator in iterable, "iterable", 1);
	var lastElement = this.head;
	for (const value of iterable) {
		lastElement = this.insertAfter(lastElement, value);
	}
};
/**
* elements - An iterator which yields each ListElement.
* @returns {GeneratorObject}  Returns a ListElement for every call to `next()`.
*/
LinkedList.prototype.elements = function* () {
	for (const element of this) yield element;
}
/**
* values - An iterator which yields the value of each ListElement.
* @returns {GeneratorObject}  Returns the value of a ListElement for every call to `next()`.
*/
LinkedList.prototype.values = function* () {
	for (const element of this) yield element.payload;
};
/**
* forEach - Calls `callback` with the value of each ListElement.
* @param {callback} callback  A callback function to run for every ListElement.
	* @callback callback
		* @param {ListElement} element  The current `ListElement`.
		* @param {Number} index	        The current index.
		* @param {LinkedList} list	The target LinkedList.
*/
LinkedList.prototype.forEach = function (callback) {
	assert.function(callback, 1);
	var index = 0;
	for (const value of this.values()) {
		callback(value, index, this);
		if (index > this.length) break;
		index++;
	}
};
/**
 * item - Returns the ListElement at the specified 0-indexed offset, or `null` if it was not found.
 * @param {number} index          A 0-indexed offset, starting from the head, to look for a ListElement at.
 * @returns {(ListElement|null)}  The found ListElement, or `null` if it was not found.
 */
LinkedList.prototype.item = function (index) {
	assert.number(index, 1);
	if (this.size === 0 || index <= -1 || index + 1 > this.size) return null;
	var loc = 0;
	for (const element of this) {
		if (loc === index) return element;
		loc++;
	}
	return null;
};
/**
 * find - Returns the first ListElement found which contains a payload matching `value`, or `null` if one was not found.
 * @param {any} value             A value to search for in the LinkedList.
 * @returns {(ListElement|null)}  The found ListElement, or `null` if it was not found.
 */
LinkedList.prototype.find = function (value) {
	for (const element of this) {
		if (element.payload === value) return element;
		if (element.next === this.tail) return null;
	}
	return null;
};
/**
 * includes- Returns `true` if a ListElement is found which contains a payload matching `value`, or `false` if one was not found.
 * @param {any} value  A value to search for in the LinkedList.
 * @returns {Boolean}  `true` if `value` was found in the LinkedList, or `false` if one was not found.
 */
LinkedList.prototype.includes = function (value) {
	return this.find(value) !== null;
};
/**
 * getPrev - Returns the ListElement located before `element`, or `null` if it was not found.
 * @param {ListElement} element   A ListElement to search for in the LinkedList.
 * @returns {(ListElement|null)}  The found ListElement, or `null` if it was not found.
 */
LinkedList.prototype.getPrev = function (element) {
	assert.argType(element instanceof this.ListElement, "ListElement", 1);
	if (element.parent !== this) return null;
	if (this.double) return element.prev;
	for (const node of this[Symbol.iterator](true)) {
		if (node.next === element) return node;
	}
	return null;
};
/**
 * last - Returns the element at the end of the LinkedList, or `null` if the list is empty.
 * @returns {(ListElement|null)}  The last ListElement, or `null` if the list is empty.
 */
LinkedList.prototype.last = function () {
	if (this.size === 0) return null;
	if (this.size === 1) return this.head.next;
	if (this.double) return this.tail.prev;
	return this.getPrev(this.tail);
};
/**
 * clear - Removes all elements from the LinkedList.
 */
LinkedList.prototype.clear = function () {
	if (this.size === 0) return;
	for (const element of this.elements()) this.remove(element);
};
/**
 * concat - Concatenates multiple LinkedLists into the callee LinkedList.
 * @param {Array} joinLists  An argument list of LinkedLists to concatenate.
 */
LinkedList.prototype.concat = function (...joinLists) {
	assert.argType(joinLists.every(v => v instanceof LinkedList), "LinkedList(s)", "list");
	for (const list of joinLists) {
		for (const element of list.elements()) this.append(element.payload);
	}
};
/**
 * remove - Removes and returns an element from the LinkedList, or `null` if it was not found.
 * @param {ListElement} element   A ListElement object to remove from the LinkedList.
 * @returns {(ListElement|null)}  The removed ListElement, or `null` if it was not found.
 */
LinkedList.prototype.remove = function (element) {
	assert.argType(element instanceof this.ListElement, "ListElement", 1);
	if (element.parent !== this) return null;
	const prevElement = this.getPrev(element);
	if (prevElement === null) return null;
	prevElement.next = element.next;
	if (this.double) element.next.prev = prevElement;
	element.parent = null;
	element.next = null;
	element.prev = null;
	this.size--;
	return element;
};
/**
 * insertAfter - Inserts a ListElement after `element`
 * @param {ListElement} element     A ListElement object to append with newElement.
 * @param {ListElement} newElement  A ListElement object to add to the LinkedList after `element`.
 * @returns {(ListElement|null)}    The newly inserted ListElement, or `null` if the target element was not found.
 */
LinkedList.prototype.insertAfter = function (element, newElement) {
	assert.argType(element instanceof this.ListElement, "ListElement", 1);
	if (element.parent !== this) return null;
	newElement = this.coerceElement(newElement);
	newElement.next = element.next;
	newElement.parent = this;
	if (this.double) {
		newElement.prev = element;
		if (element.next !== null) element.next.prev = newElement;
	}
	element.next = newElement;
	this.size++;
	return newElement;
};
/**
 * insertBefore - Inserts a ListElement before `element`, or `null` if it was not found.
 * @param {ListElement} element           A ListElement object to prepend with newElement.
 * @param {(ListElement|any)} newElement  A ListElement or arbitrary value to add to the LinkedList before `element`.
 * @returns {(ListElement|null)}          The newly inserted ListElement, or `null` if the target element was not found.
 */
LinkedList.prototype.insertBefore = function (element, newElement) {
	assert.argType(element instanceof this.ListElement, "ListElement", 1);
	if (element.parent !== this) return null;
	newElement = this.coerceElement(newElement);
	const prevElement = this.getPrev(element);
	if (prevElement === null) return null;
	this.insertAfter(prevElement, newElement);
	return newElement;
};
/**
 * prepend - Inserts a ListElement at the beginning of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to add to the beginning of the LinkedList.
 * @returns {ListElement}    The newly inserted ListElement.
 */
LinkedList.prototype.prepend = function (newElement) {
	return this.insertAfter(this.head, newElement);
};
/**
 * prepend - Inserts a ListElement at the end of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to add to the end of the LinkedList.
 * @returns {ListElement}           The newly inserted ListElement.
 */
LinkedList.prototype.append = function (newElement) {
	return this.insertBefore(this.tail, newElement);
};
/**
 * push - Inserts a ListElement at the end of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to add to the end of the LinkedList.
 * @returns {ListElement}           The newly inserted ListElement.
 */
LinkedList.prototype.push = LinkedList.prototype.append;
/**
 * unshift - Inserts a ListElement at the beginning of the LinkedList.
 * @param {ListElement} newElement  A ListElement object to add to the beginning of the LinkedList.
 * @returns {ListElement}           The newly inserted ListElement.
 */
LinkedList.prototype.unshift = LinkedList.prototype.prepend;
/**
 * pop - Removes an element from the end of the LinkedList and returns it.
 * @returns {(ListElement|null)}  The removed ListElement, , or `null` if the list is empty.
 */
LinkedList.prototype.pop = function () {
	if (this.double) return this.remove(this.tail.prev);
	return this.remove(this.last());
};
/**
 * shift - Removes an element from the beginning of the LinkedList and returns it.
 * @returns {(ListElement|null)}  The removed ListElement, , or `null` if the list is empty. */
LinkedList.prototype.shift = function () {
	return this.remove(this.head.next);
};
/**
 * pushBack - Moves a ListElement to the end of the LinkedList.
 * @param {ListElement} element  A ListElement object to move to the end of the LinkedList.
 */
LinkedList.prototype.pushBack = function (element) {
	if (element.parent === this) this.remove(element);
	this.append(element);
};
module.exports = LinkedList;