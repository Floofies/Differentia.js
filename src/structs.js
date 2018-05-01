var BinaryTree = require('./structs/BinaryTree');
var LinkedList = require('./structs/LinkedList');
var OffsetArray = require('./structs/OffsetArray');

var structs = Object.assign({}, BinaryTree, LinkedList, OffsetArray);
module.exports = structs;