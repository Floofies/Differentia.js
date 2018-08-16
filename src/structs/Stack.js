const DoubleLinkedList = require("./DoubleLinkedList.js");
/**
* Stack - A bounded Stack which inherits from DoubleLinkedList.
* @param {Iterable} [iterable = null]  A source iterable to populate the Stack with.
*/
function Stack(iterable = null, limit = Number.MAX_SAFE_INTEGER) {
	this.list = new DoubleLinkedList(iterable);
	this.size = this.list.size;
	this.limit = limit;
};
Stack.prototype[Symbol.iterator] = function () {
	return this.list.values();
}
/**
 * clear - Removes all elements from the Stack.
 */
Stack.prototype.clear = function () {
	this.list.clear();
};
/**
 * item - Returns the element at the specified 0-indexed offset, or `null` if it was not found.
 * @param {number} index  A 0-indexed offset, starting from the head, to look for an element at.
 * @returns {(any|null)}  The found element, or `null` if it was not found.
 */
Stack.prototype.item = function (index) {
	const element = this.list.item(index);
	if (element === null) return null;
	return element.payload;
};
/**
 * add - Inserts an element at the end of the Stack. Does not accept null values.
 * @param {any} value  An element to add to the end of the Stack.
 * @returns {boolean}  A Boolean indicating whether or not the addition was successful.
 */
Stack.prototype.add = function (value) {
	if (value === null) return false;
	if (this.size >= this.limit) return false;
	this.list.push(value);
	this.size++;
	return true;
};
/**
 * remove - Removes and returns an element from the Stack, or `null` if it was not found.
 * @returns {(ListElement|null)}  The removed element, or `null` if it was not found.
 */
Stack.prototype.remove = function () {
	const element = this.list.pop();
	if (element === null) return null;
	this.size--;
	return element.payload;
};
/**
 * head - Returns the element at the beginning of the Stack, or `null` if the Stack is empty.
 * @returns {(ListElement|null)}  The first element in the Stack, or `null` if the Stack is empty.
 */
Stack.prototype.head = function () {
	const element = this.list.last();
	if (element === null) return null;
	return element.payload;
};
/**
 * end - Returns the element at the end of the Stack, or `null` if the Stack is empty.
 * @returns {(ListElement|null)}  The last element in the Stack, or `null` if the Stack is empty.
 */
Stack.prototype.end = function () {
	const element = this.list.first();
	if (element === null) return null;
	return element.payload;
};
module.exports = Stack;