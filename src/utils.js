// Checks if certain RegExp props are supported.
const supportedRegExpProps = {
	sticky: "sticky" in RegExp.prototype,
	unicode: "unicode" in RegExp.prototype,
	flags: "flags" in RegExp.prototype
};
/**
* assert - Logs or throws an Error if `boolean` is false,
*  If `boolean` is `true`, nothing happens.
*  If `errorType` is set, throws a new Error of type `errorType` instead of logging to console.
* @param  {Boolean} boolean         The activation Boolean.
* @param  {String} message          The message to log, or include in the Error.
* @param  {Error} errorType = null  If not `null`, throws a new error of `errorType`.
*/
function assert(boolean, message, errorType = null) {
	if (boolean) return;
	if (errorType !== null && (errorType === Error || Error.isPrototypeOf(errorType))) {
		throw new errorType(message);
	} else {
		console.error(message);
	}
}
// Thunks to `assert` for method argument type checking.
assert.props = function (input, props, argName) {
	for (var prop of props[Symbol.iterator]()) {
		assert(prop in input, "Argument " + argName + " must have a \"" + prop + "\" property.", TypeError);
	}
};
assert.argType = (boolean, typeString, argName) => assert(boolean, "Argument " + argName + " must be " + typeString, TypeError);
assert.string = (input, argName) => assert.argType(typeof input === "string", "a String", argName);
assert.number = (input, argName) => assert.argType(typeof input === "number", "a Number", argName);
assert.boolean = (input, argName) => assert.argType(typeof input === "boolean", "a Boolean", argName);
assert.function = (input, argName) => assert.argType(typeof input === "function", "a Function", argName);
assert.object = (input, argName) => assert.argType(isObject(input), "an Object", argName);
assert.array = (input, argName) => assert.argType(Array.isArray(input), "an Array", argName);
assert.container = (input, argName) => assert.argType(isContainer(input), "an Object or Array", argName);
/**
* isContainer - Returns `true` if `input` is an Object or Array, otherwise returns `false`.
* @param {any} input
* @returns {Boolean}
*/
function isContainer(input) {
	return input !== null && (Array.isArray(input) || typeof input === "object");
}
/**
* isObject - Returns `true` if `input` is an Object and not an Array, or `false` if otherwise.
* @param {any} input
* @returns {Boolean}
*/
function isObject(input) {
	return input !== null && (typeof (input) === "object" && !Array.isArray(input));
}
/**
* isObject - Returns `true` if `input` is a Primitive, or `false` if otherwise.
* @param {any} input
* @returns {Boolean}
*/
var primitives = ["string", "boolean", "number", "symbol"];
function isPrimitive(input) {
	return input === null || primitives.includes(typeof input);
}
/**
* createContainer - Returns a new empty Array/Object matching the type of `input`.
*  If `input` is not an Object or Array, `null` is returned.
* @param {(Object|Array)} input   An Object or Array.
* @returns {(Object|Array|null)}
*/
function createContainer(input) {
	if (Array.isArray(input)) {
		return new Array();
	}
	if (input !== null && typeof input === "object") {
		return new Object();
	}
	throw new TypeError("The given parameter must be an Object or Array");
}
/**
* getContainerLength - Returns the number of enumerable indexes/properties of `input`.
*  If `input` is not an Object or Array, a TypeError is thrown.
* @param {(Object|Array)} input
* @returns {Number}            The number of enumerable properties/indexes in `input`.
*/
function getContainerLength(input) {
	if (Array.isArray(input)) {
		return input.length;
	}
	if (input !== null && typeof input === "object") {
		return Object.keys(input).length;
	}
	throw new TypeError("The given parameter must be an Object or Array");
}
/**
* runCallback - Executes `state.parameters.callback` and returns whatever the callback does.
* @param {Object} state  A reference to the state flyweight yielded by `searchIterator`.
* @returns {any}
*/
function runCallback(state) {
	return state.parameters.callback(state.currentValue, state.accessor, state.tuple.subject);
}
module.exports = {
	supportedRegExpProps,
	assert,
	isContainer,
	isObject,
	isPrimitive,
	createContainer,
	getContainerLength,
	runCallback
};