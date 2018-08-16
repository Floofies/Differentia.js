const LinkedList = require("./LinkedList");
/**
 * DoubleLinkedList - A Doubly Linked Acyclic LinkedList with elements that have `prev` links.
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new DoubleLinkedList.
 */
function DoubleLinkedList(iterable = null) {
	this.tail = new this.ListElement(null, null);
	this.tail.parent = this;
	this.head = new this.ListElement(null, this.tail);
	this.head.parent = this;
	this.tail.prev = this.head;
	this.double = true;
	this.circular = false;
	this.size = 0;
	this.from(iterable);
};
DoubleLinkedList.prototype = Object.create(LinkedList.prototype);
DoubleLinkedList.prototype[Symbol.toStringTag] = "DoubleLinkedList";
// Adds ListElement to the DoubleLinkedList constructor for convenience.
DoubleLinkedList.ListElement = LinkedList.prototype.ListElement;
module.exports = DoubleLinkedList;