const OffsetArrayStruct = require('./structs/OffsetArray');

module.exports = {
	ArrayList: require('./structs/ArrayList'),
	BinaryTree: require('./structs/BinaryTree'),
	CircularDoubleLinkedList: require('./structs/CircularDoubleLinkedList'),
	CircularLinkedList: require('./structs/CircularLinkedList'),
	DoubleLinkedList: require('./structs/DoubleLinkedList'),
	LinkedList: require('./structs/LinkedList'),
	RedBlackTree: require('./structs/RedBlackTree'),
	OffsetArray: OffsetArrayStruct.OffsetArray,
	Queue: OffsetArrayStruct.Queue,
	Stack: OffsetArrayStruct.Stack
};