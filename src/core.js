/**
* assert - Logs or throws an Error if `boolean` is false,
*  If `boolean` is `true`, nothing happens.
*  If `errorType` is set, throws a new Error of type `errorType` instead of logging to console.
* @param  {Boolean} boolean         The activation Boolean.
* @param  {String} message          The message to log, or include in the Error.
* @param  {Error} errorType = null  If not `null`, throws a new error of `errorType`.
*/
function assert(boolean, message, errorType = null) {
	if (!boolean) {
		if (errorType !== null && (errorType === Error || Error.isPrototypeOf(errorType))) {
			throw new errorType(message);
		} else {
			console.error(message);
		}
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
/**
* createIterationState - Creates the state object for searchIterator.
* @returns {Object}  A new iteration state object with sane defaults.
*/
function createIterationState() {
	return {
		accessors: null,
		traverse: true,
		tuple: {},
		existing: null,
		isContainer: false,
		noIndex: false,
		targetTuples: [],
		length: 0,
		iterations: 0,
		isLast: false,
		isFirst: true,
		accessor: null,
		currentValue: null
	};
}
/**
* searchIterator - An adaptable graph search algorithm
*  Returns an Iterator usable with `next()`.
* @param {(Object|Array)} subject               The Object/Array to access.
* @param {(Queue|Stack)} targetTuples           An instance of `Queue` or `Stack` to store target nodes in.
* @param {(Object|Array|null)} [search = null]  The Object/Array used to target accessors in `subject`
* @returns {Iterator}
*/
function* searchIterator(subject, targetTuples, search = null) {
	assert.container(subject, 1);
	assert.argType(search === null || (isContainer(search) && getContainerLength(search) > 0), "a non-empty Object or Array", 2);
	var state = createIterationState();
	if (search === null) {
		search = subject;
	}
	if (search === subject) {
		state.noIndex = true;
	}
	state.subjectRoot = subject;
	state.searchRoot = search;
	// Unique Node Map
	var nodeMap = new Map();
	// Add Root Tuple to Stack
	state.targetTuples = targetTuples;
	state.targetTuples.push({
		search: search,
		subject: subject
	});
	nodeMap.set(state.searchRoot, state.targetTuples.item(0));
	// Iterate `state.targetTuples`
	_traverse: while (state.targetTuples.length > 0) {
		// Traverse `search`, iterating through it's properties.
		_iterate: for (
			// onFirst:
				state.tuple = state.targetTuples.take(),
				state.iterations = 0,
				state.accessors = Object.keys(state.tuple.search);
			// onEvery:
				state.accessor = state.accessors[state.iterations],
				state.length = state.accessors.length,
				// breakOnFalse:
					state.iterations < state.length;
			// onAfterEvery:
				state.iterations++
		) {
			// Indicates if iterated property is a container
			state.isContainer = isContainer(state.tuple.search[state.accessor]);
			// Set to a previously seen tuple if the container was seen before
			state.existing = state.isContainer ? nodeMap.get(state.tuple.search[state.accessor]) : null;
			if (state.existing === undefined) {
				state.existing = null;
			}
			// If the value is a container, hasn't been seen before, and has enumerables, then we can traverse it.
			state.traverse = state.isContainer && state.existing === null && getContainerLength(state.tuple.search[state.accessor]) > 0;
			// If the value can't be traversed, `state.targetTuples` is empty, and we are on the last enumerable, then we're on the last iteration.
			state.isLast = !state.traverse && state.iterations === state.length - 1 && state.targetTuples.length === 0;
			state.currentValue = state.tuple.subject[state.accessor];
			try {
				// Yield the Shared State Object
				yield state;
			} catch (exception) {
				console.error("An error occured while traversing \"" + loc + "\" at node depth " + state.targetTuples.length + ":");
				console.error(exception);
				console.info("Node Traversal Stack:");
				console.info(state.targetTuples);
			}
			if (state.isFirst) {
				state.isFirst = false;
			}
			if (!state.traverse || (!state.noIndex && !(state.accessor in state.tuple.subject))) {
				continue _iterate;
			}
			// Node has not been seen before, so traverse it
			var nextTuple = {};
			// Travese the Tuple's properties
			for (var unit in state.tuple) {
				if (
					(
						unit === "search"
						|| unit === "subject"
						|| isContainer(state.tuple[unit][state.accessor])
					)
					&& state.accessor in state.tuple[unit]
				) {
					nextTuple[unit] = state.tuple[unit][state.accessor];
				}
			}
			// Save the Tuple to `nodeMap`
			nodeMap.set(state.tuple.search[state.accessor], nextTuple);
			// Push the next Tuple into the stack
			state.targetTuples.push(nextTuple);
		}
	}
}
/**
* dfs - A thunk to `searchIterator`, providing a Stack for target nodes.
*  Causes `seatchIterator` to behave as Depth-First Search.
* @param {(Object|Array)} subject               The Object/Array to access.
* @param {(Object|Array|null)} [search = null]  The Object/Array used to target accessors in `subject`
* @returns {Iterator}
*/
function dfs(subject, search = null) {
	return searchIterator(subject, new structs.Stack(), search);
}
/**
* bfs - A thunk to `searchIterator`, providing a Queue for target nodes.
*  Causes `seatchIterator` to behave as Breadth-First Search.
* @param {(Object|Array)} subject               The Object/Array to access.
* @param {(Object|Array|null)} [search = null]  The Object/Array used to target accessors in `subject`
* @returns {Iterator}
*/
function bfs(subject, search = null) {
	return searchIterator(subject, new structs.Queue(), search);
}
/**
* runStrategy - Calls `strategy.entry` and `strategy.main` with the state of the search iterator.
*  `strategy.entry` is optional. It is only executed once, for the first value the iterator yields.
* @param {Object} strategy      An Object containing an optional `entry` property and a required `main` property.
	* @param {callback} strategy.entry  A function to run once, on the first yielded state.
		* @callback strategy.entry
		* @param {Object} state  A reference to the state flyweight yielded by `searchIterator`.
	* @param {callback} strategy.main   A function to run on every yielded state.
		* @callback strategy.main
		* @param {Object} state  A reference to the state flyweight yielded by `searchIterator`.
	* @param {callback} strategy.done   A function to run on the last state.
		* @callback strategy.done
		* @param {Object} state  A reference to the state flyweight yielded by `searchIterator`.
		* @param {(Object|undefined)} returnValue  The value returned by `strategy.main`.
* @param {Generator} searchAlg  A Generator to use as the search algorthm.
* @param {Object} parameters    An Object containing a required `subject` property, and an optional `search` property.
* @returns {Mixed}              Returns anything returned by `strategy.main` or `strategy.done`.
*/
function runStrategy(strategy, searchAlg, parameters) {
	assert.object(parameters, 3);
	assert.props(parameters, ["subject", "search"], 3);
	// Initialize search algorithm.
	const iterator = searchAlg(parameters.subject, parameters.search);
	var iteration = iterator.next();
	var state = iteration.value;
	// Save parameters in a prop the strategy can see
	state.parameters = parameters;
	try {
		// Run `entry` on the first element
		if ("entry" in strategy) {
			strategy.entry(state);
		}
		var returnValue;
		while (!iteration.done) {
			state = iteration.value;
			// Run `main` on every element
			returnValue = strategy.main(state);
			if (returnValue !== undefined) {
				break;
			}
			iteration = iterator.next();
		}
		// Run `done` on the last element
		if ("done" in strategy) {
			var doneReturnValue = strategy.done(state, returnValue);
			if (doneReturnValue !== undefined) {
				returnValue = doneReturnValue;
			}
		}
	} catch (error) {
		if ("error" in strategy) {
			// Run `error` if an error occured;
			var errorReturnValue = strategy.error(state, error);
			if (errorReturnValue !== undefined) {
				returnValue = errorReturnValue;
			}
		} else {
			throw error;
		}
	}
	return returnValue;
}