var OffsetArrayStruct = require('./structs/OffsetArray');

module.exports = {
	ArrayList: require('./structs/ArrayList'),
	BinaryTree: require('./structs/BinaryTree'),
	CircularDoubleLinkedList: require('./structs/CircularDoubleLinkedList'),
	CircularLinkedList: require('./structs/CircularLinkedList'),
	DoubleLinkedList: require('./structs/DoubleLinkedList'),
	LinkedList: require('./structs/LinkedList'),
	RedBlackTree: require('./structs/RedBlackTree'),
};

module.exports.OffsetArray = OffsetArrayStruct.OffsetArray;
module.exports.Queue = OffsetArrayStruct.Queue
module.exports.Stack = OffsetArrayStruct.Stack