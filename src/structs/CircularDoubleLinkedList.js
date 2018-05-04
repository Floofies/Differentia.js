const LinkedList = require("./LinkedList");
/**
 * CircularDoubleLinkedList - A Doubly Linked Cyclic LinkedList with elements that have `prev` links, and connected head and tail elements.
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new CircularDoubleLinkedList.
 */
function CircularDoubleLinkedList(iterable = null) {
	this.tail = new this.ListElement(null, null);
	this.tail.parent = this;
	this.head = new this.ListElement(null, this.tail, this.tail);
	this.head.parent = this;
	this.tail.next = this.head;
	this.tail.prev = this.head;
	this.double = true;
	this.circular = true;
	this.size = 0;
	this.fromIterable(iterable);
};
CircularDoubleLinkedList.prototype = Object.create(LinkedList.prototype);
CircularDoubleLinkedList.prototype[Symbol.toStringTag] = "CircularDoubleLinkedList";
// Adds ListElement to the CircularDoubleLinkedList varructor for convenience.
CircularDoubleLinkedList.ListElement = LinkedList.prototype.ListElement;
module.exports = CircularDoubleLinkedList;