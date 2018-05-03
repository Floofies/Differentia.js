var utils = require("./utils");
var structs = require("./structs");
/**
* searchIterator - An adaptable graph search algorithm
*  Returns an Iterator usable with `next()`.
* @param {(Object|Array)} subject               The Object/Array to access.
* @param {(Queue|Stack)} targetTuples           An instance of `Queue` or `Stack` to store target nodes in.
* @param {(Object|Array|null)} [search = null]  The Object/Array used to target accessors in `subject`
* @returns {Iterator}
*/
function* searchIterator(subject, targetTuples, search = null) {
	utils.assert.container(subject, 1);
	utils.assert.argType(search === null || (utils.isContainer(search) && utils.getContainerLength(search) > 0), "a non-empty Object or Array", 2);
	var state = searchIterator.createIterationState();
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
			state.isContainer = utils.isContainer(state.tuple.search[state.accessor]);
			// Set to a previously seen tuple if the container was seen before
			state.existing = state.isContainer ? nodeMap.get(state.tuple.search[state.accessor]) : null;
			if (state.existing === undefined) {
				state.existing = null;
			}
			// If the value is a container, hasn't been seen before, and has enumerables, then we can traverse it.
			state.traverse = state.isContainer && state.existing === null && utils.getContainerLength(state.tuple.search[state.accessor]) > 0;
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
						|| utils.isContainer(state.tuple[unit][state.accessor])
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
* createIterationState - Creates the state object for searchIterator.
* @returns {Object}  A new iteration state object with sane defaults.
*/
searchIterator.createIterationState = function () {
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
* dfs - A thunk to `searchIterator`, providing a Stack for target nodes.
*  Causes `seatchIterator` to behave as Depth-First Search.
* @param {(Object|Array)} subject               The Object/Array to access.
* @param {(Object|Array|null)} [search = null]  The Object/Array used to target accessors in `subject`
* @returns {Iterator}
*/
searchIterator.dfs = function (subject, search = null) {
	return searchIterator(subject, new structs.Stack(), search);
}
/**
* bfs - A thunk to `searchIterator`, providing a Queue for target nodes.
*  Causes `seatchIterator` to behave as Breadth-First Search.
* @param {(Object|Array)} subject               The Object/Array to access.
* @param {(Object|Array|null)} [search = null]  The Object/Array used to target accessors in `subject`
* @returns {Iterator}
*/
searchIterator.bfs = function (subject, search = null) {
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
searchIterator.runStrategy = function (strategy, searchAlg, parameters) {
	utils.assert.object(parameters, 3);
	utils.assert.props(parameters, ["subject", "search"], 3);
	// Initialize search algorithm.
	var iterator = searchAlg(parameters.subject, parameters.search);
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
module.exports = searchIterator;
