const DoubleLinkedList = require("./DoubleLinkedList.js");
/**
* Queue - A bounded Queue which inherits from DoubleLinkedList.
* @param {Iterable} [iterable = null]  A source iterable to populate the Queue with.
*/
function Queue(iterable = null, limit = Number.MAX_SAFE_INTEGER) {
	this.list = new DoubleLinkedList(iterable);
	this.size = this.list.size;
	this.limit = limit;
};
Queue.prototype[Symbol.iterator] = function () {
	return this.list.values();
}
/**
 * clear - Removes all elements from the Queue.
 */
Queue.prototype.clear = function () {
	this.list.clear();
};
/**
 * item - Returns the element at the specified 0-indexed offset, or `null` if it was not found.
 * @param {number} index  A 0-indexed offset, starting from the head, to look for an element at.
 * @returns {(any|null)}  The found element, or `null` if it was not found.
 */
Queue.prototype.item = function (index) {
	const element = this.list.item(index);
	if (element === null) return null;
	return element.payload;
};
/**
 * add - Inserts an element at the end of the Queue. Does not accept null values.
 * @param {any} value  An element to add to the end of the Queue.
 * @returns {boolean}  A Boolean indicating whether or not the addition was successful.
 */
Queue.prototype.add = function (value) {
	if (value === null) return false;
	if (this.size >= this.limit) return false;
	this.list.push(value);
	this.size++;
	return true;
};
/**
 * remove - Removes and returns an element from the Queue, or `null` if it was not found.
 * @returns {(ListElement|null)}  The removed element, or `null` if it was not found.
 */
Queue.prototype.remove = function () {
	const element = this.list.shift();
	if (element === null) return null;
	this.size--;
	return element.payload;
};
/**
 * head - Returns the element at the beginning of the Queue, or `null` if the Queue is empty.
 * @returns {(ListElement|null)}  The first element in the Queue, or `null` if the Queue is empty.
 */
Queue.prototype.head = function () {
	const element = this.list.first();
	if (element === null) return null;
	return element.payload;
};
/**
 * end - Returns the element at the end of the Queue, or `null` if the Queue is empty.
 * @returns {(ListElement|null)}  The last element in the Queue, or `null` if the Queue is empty.
 */
Queue.prototype.end = function () {
	const element = this.list.last();
	if (element === null) return null;
	return element.payload;
};
module.exports = Queue;