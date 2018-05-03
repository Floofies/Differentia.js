var DoubleLinkedList = require('./DoubleLinkedList');
/**
 * ArrayList - A Doubly Linked Acyclic LinkedList with an Array-like interface.
 * @param {Iterable} [iterable=null]  Optional iterable to populate the new ArrayList.
 */
function ArrayList(iterable = null) {
	var list = new DoubleLinkedList(iterable);
	var proxy = new Proxy(list, list.handler);
	return proxy;
};
ArrayList.prototype = Object.create(DoubleLinkedList.prototype);
var numberRegex = /^\d+$/;
ArrayList.prototype.acc = function (accessor, handler) {
	var isSymbol = typeof accessor === "symbol";
	if (!isSymbol) {
		var int = parseInt(accessor, 10);
	}
	if (!isSymbol && !Number.isNaN(int) && (accessor.match(numberRegex) !== null)) {
		if ("number" in handler) return handler.number(int);
	} else {
		if ("string" in handler) return handler.string(accessor);
	}
	throw new TypeError("Can not look for value \"" + accessor + "\" in ArrayList.");
};
ArrayList.prototype.handler = {
	get: function (list, accessor) {
		return ArrayList.prototype.acc(accessor, {
			string: acc => list[acc],
			number: acc => list.item(acc)
		});
	},
	set: function (list, accessor, value) {
		return ArrayList.prototype.acc(accessor, {
			string: acc => list[acc] = value,
			number: acc => list.insertBefore(list.item(acc), value)
		});
	},
	has: function (list, accessor) {
		return ArrayList.prototype.acc(accessor, {
			string: acc => acc in list,
			number: acc => list.size >= acc && acc > -1
		});
	}
};
module.exports = ArrayList;