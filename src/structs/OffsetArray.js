/**
* OffsetArray - An Array wrapper which maintains an offset view of an Array.
* @param {Iterable} [iterable = null]  A source iterable to populate the Array with.
*/
function OffsetArray(iterable = null) {
	if (iterable !== null) {
		this.array = Array.from(iterable);
	} else {
		this.array = [];
	}
	this.length = this.array.length;
	this.index0 = 0;
};
/**
* OffsetArray.prototype.item - Returns a value by it's index, or `undefined` if it does not exist.
* @param {Number} index
* @returns {any}
*/
OffsetArray.prototype.item = function (index) {
	return this.array[this.index0 + Number(index)];
};
/**
* OffsetArray.prototype.set - Assigns a value to an index.
* @param {Number} index
* @param {any} value
* @returns {Number}  The new length of the view.
*/
OffsetArray.prototype.set = function (index, value) {
	var newIndex = this.index0 + Number(index);
	if (newIndex >= this.length) {
		this.length = newIndex + 1;
	}
	this.array[newIndex] = value;
	return this.length;
};
/**
* OffsetArray.prototype.shift - Returns the first element and excludes it from the view.
*  If the view is empty, it will return `undefined`.
* @returns {any}
*/
OffsetArray.prototype.shift = function () {
	if (this.length !== 0) {
		this.length--;
		this.index0++;
		return this.array[this.index0 - 1];
	}
	return undefined;
};
/**
* OffsetArray.prototype.pop - Returns the last element and excludes it from the view.
*  Returns the new length of the view.
*  If the view is empty, it will return `undefined`.
* @returns {any}
*/
OffsetArray.prototype.pop = function () {
	if (this.length !== 0) {
		this.length--;
		return this.array[this.index0 + this.length];
	}
	return undefined;
};
/**
* OffsetArray.prototype.push - Adds a value to the end of the view.
*  Returns the new length of the view.
* @param {any} value
*/
OffsetArray.prototype.push = function (value) {
	this.array[this.index0 + this.length] = value;
	return ++this.length;
};
/**
* Queue - Wraps OffsetArray, providing `OffsetArray.prototype.shift` as a `take` property.
* @param {Iterable} [iterable = null]  A source iterable to populate the Array with.
*/
function Queue(iterable = null) {
	OffsetArray.call(this, iterable);
	this.take = OffsetArray.prototype.shift;
};
Queue.prototype = OffsetArray.prototype;
/**
* Stack - Wraps OffsetArray, providing `OffsetArray.prototype.pop` as a `take` property.
* @param {Iterable} [iterable = null]  A source iterable to populate the Array with.
*/
function Stack(iterable = null) {
	OffsetArray.call(this, iterable);
	this.take = OffsetArray.prototype.pop;
};
Stack.prototype = OffsetArray.prototype;

module.exports.OffsetArray = OffsetArray;
module.exports.Queue = Queue;
module.exports.Stack = Stack;
