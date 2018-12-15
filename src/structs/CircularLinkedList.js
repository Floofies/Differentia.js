const LinkedList = require("./LinkedList");
/**
 * CircularLinkedList - A Cyclic LinkedList with connected head and tail elements.
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new CircularLinkedList.
 */
function CircularLinkedList(iterable = null) {
	this.tail = new this.ListElement(null);
	this.tail.parent = this;
	this.head = new this.ListElement(null, this.tail);
	this.head.parent = this;
	this.tail.next = this.head;
	this.double = false;
	this.circular = true;
	this.size = 0;
	this.from(iterable);
};
CircularLinkedList.prototype = Object.create(LinkedList.prototype);
CircularLinkedList.prototype[Symbol.toStringTag] = "CircularLinkedList";
// Adds ListElement to the CircularLinkedList constructor for convenience.
CircularLinkedList.ListElement = LinkedList.prototype.ListElement;
module.exports = CircularLinkedList;