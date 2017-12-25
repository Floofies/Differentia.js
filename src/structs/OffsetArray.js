/**
* OffsetArray - An Array wrapper which maintains an offset view of an Array.
* @param {Iterable} [iterable = null]  A source iterable to populate the Array with.
*/
structs.OffsetArray = function (iterable = null) {
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
structs.OffsetArray.prototype.item = function (index) {
	return this.array[this.index0 + Number(index)];
};
/**
* OffsetArray.prototype.set - Assigns a value to an index.
* @param {Number} index
* @param {any} value
* @returns {Number}  The new length of the view.
*/
structs.OffsetArray.prototype.set = function (index, value) {
	const newIndex = this.index0 + Number(index);
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
structs.OffsetArray.prototype.shift = function () {
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
structs.OffsetArray.prototype.pop = function () {
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
structs.OffsetArray.prototype.push = function (value) {
	this.array[this.index0 + this.length] = value;
	return ++this.length;
};
/**
* Queue - Wraps OffsetArray, providing `OffsetArray.prototype.shift` as a `take` property.
* @param {Iterable} [iterable = null]  A source iterable to populate the Array with.
*/
structs.Queue = function (iterable = null) {
	structs.OffsetArray.call(this, iterable);
	this.take = structs.OffsetArray.prototype.shift;
};
structs.Queue.prototype = structs.OffsetArray.prototype;
/**
* Stack - Wraps OffsetArray, providing `OffsetArray.prototype.pop` as a `take` property.
* @param {Iterable} [iterable = null]  A source iterable to populate the Array with.
*/
structs.Stack = function (iterable = null) {
	structs.OffsetArray.call(this, iterable);
	this.take = structs.OffsetArray.prototype.pop;
};
structs.Stack.prototype = structs.OffsetArray.prototype;