/*
Differentia.js
JS Object Algorithm Library
https://github.com/Floofies/Differentia.js
*/
var differentia = (function () {
	"use strict";
	// Checks if certain RegExp props are supported.
	var supportedRegExpProps = {
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
	}
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
	}
	Queue.prototype = OffsetArray.prototype;
	/**
	* Stack - Wraps OffsetArray, providing `OffsetArray.prototype.pop` as a `take` property.
	* @param {Iterable} [iterable = null]  A source iterable to populate the Array with.
	*/
	function Stack(iterable = null) {
		OffsetArray.call(this, iterable);
		this.take = OffsetArray.prototype.pop;
	}
	Stack.prototype = OffsetArray.prototype;
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
	function runCallback (state) {
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
				state.tuple = state.targetTuples.take(),
				state.iterations = 0,
				state.accessors = Object.keys(state.tuple.search);

				state.accessor = state.accessors[state.iterations],
				state.length = state.accessors.length,
				state.iterations < state.length;

				state.iterations++
			) {
				// Indicates if iterated property is a container
				state.isContainer = isContainer(state.tuple.search[state.accessor]);
				state.existing = state.isContainer ? nodeMap.get(state.tuple.search[state.accessor]) : null;
				if (state.existing === undefined) {
					state.existing = null;
				}
				// If the value is a container, hasn't been seen before, and has enumerables, then we can traverse it.
				state.traverse = state.isContainer && state.existing === null && getContainerLength(state.tuple.search[state.accessor]) > 0;
				// If the value can't be traversed, state.targetTuples is empty, and we are on the last enumerable, we know we're on the last iteration.
				// I call this "Terminating Tail-Edge Preemption" since the generator will terminate after this last yield.
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
		return searchIterator(subject, new Stack(), search);
	}
	/**
	* bfs - A thunk to `searchIterator`, providing a Queue for target nodes.
	*  Causes `seatchIterator` to behave as Breadth-First Search.
	* @param {(Object|Array)} subject               The Object/Array to access.
	* @param {(Object|Array|null)} [search = null]  The Object/Array used to target accessors in `subject`
	* @returns {Iterator}
	*/
	function bfs(subject, search = null) {
		return searchIterator(subject, new Queue(), search);
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
					return doneReturnValue;
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
	const strategies = {};
	/**
	* clone - Creates a deep clone of `subject`.
	* @param  {(Object|Array)} subject               The Object/Array to clone.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {(Object|Array)}                     A clone of `subject`.
	*/
	strategies.clone = {
		interface: function (subject, search = null) {
			return runStrategy(strategies.clone, dfs, {
				subject: subject,
				search: search
			});
		},
		entry: function (state) {
			state.cloneRoot = createContainer(state.tuple.subject);
			state.tuple.clone = state.cloneRoot;
		},
		main: function (state) {
			if (state.isContainer) {
				if (state.currentValue instanceof RegExp) {
					// Clone a Regular Expression
					var flags = "";
					if (supportedRegExpProps.flags) {
						flags = state.currentValue.flags;
					} else {
						if (state.currentValue.global) flags += "g";
						if (state.currentValue.ignorecase) flags += "i";
						if (state.currentValue.multiline) flags += "m";
						if (supportedRegExpProps.sticky && state.currentValue.sticky) flags += "y";
						if (supportedRegExpProps.unicode && state.currentValue.unicode) flags += "u";
					}
					state.tuple.clone[state.accessor] = new RegExp(state.currentValue.source, flags);
				} else {
					if (state.existing !== null) {
						state.tuple.clone[state.accessor] = state.existing.clone;
					} else {
						state.tuple.clone[state.accessor] = createContainer(state.currentValue);
					}
				}
			} else if (isPrimitive(state.currentValue)) {
				// Clone a Primitive.
				state.tuple.clone[state.accessor] = state.currentValue;
			}
			if (state.isLast) {
				return state.cloneRoot;
			}
		}
	};
	/**
	* diff - Determines if `compared`'s structure, properties, or values differ in any way from `subject`
	* @param  {(Object|Array)} subject               The first Object/Array to compare.
	* @param  {(Object|Array)} compare               The second Object/Array to compare.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {Boolean}                          Indicates if a difference was found.
	*/
	strategies.diff = {
		interface: function (subject, compare, search = null) {
			if (search === null && getContainerLength(subject) !== getContainerLength(compare)) {
				return true;
			}
			return runStrategy(strategies.diff, dfs, {
				subject: subject,
				compare: compare,
				search: search
			});
		},
		entry: function (state) {
			state.tuple.compare = state.parameters.compare;
		},
		main: function (state) {
			if (!("compare" in state.tuple) && !isContainer(state.tuple.compare) || !(state.accessor in state.tuple.compare)) {
				return true;
			}
			var subjectProp = state.currentValue;
			var compareProp = state.tuple.compare[state.accessor];
			if (((state.noIndex && state.isContainer) || isContainer(subjectProp)) && isContainer(compareProp)) {
				if (subjectProp instanceof RegExp && compareProp instanceof RegExp) {
					if (
						subjectProp.source !== compareProp.source
						|| subjectProp.ignoreCase !== compareProp.ignoreCase
						|| subjectProp.global !== compareProp.global
						|| subjectProp.multiline !== compareProp.multiline
						|| (supportedRegExpProps.sticky && subjectProp.sticky !== compareProp.sticky)
						|| (supportedRegExpProps.unicode && subjectProp.unicode !== compareProp.unicode)
						|| (supportedRegExpProps.flags && subjectProp.flags !== compareProp.flags)
					) {
						return true;
					}
				} else if (state.noIndex && getContainerLength(compareProp) !== getContainerLength(subjectProp)) {
					// Object index/property count does not match, they are different.
					return true;
				}
			} else if (subjectProp !== compareProp) {
				return true;
			}
			if (state.isLast) {
				return false;
			}
		}
	};
	/**
	* diffClone - Clones the parts of `subject` that differ from `compared`'s structure, properties, or values.
	* @param  {(Object|Array)} subject               The first Object/Array to compare and also clone.
	* @param  {(Object|Array)} compare               The second Object/Array to compare.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {(Object|Array)}                     A clone of `subject`, only including differences.
	*/
	strategies.diffClone = {
		interface: function (subject, compare, search = null) {
			return runStrategy(strategies.diffClone, dfs, {
				subject: subject,
				compare: compare,
				search: search
			});
		},
		entry: function (state) {
			strategies.clone.entry(state);
			strategies.diff.entry(state);
		},
		main: function (state) {
			if (strategies.diff.main(state)) {
				return strategies.clone.main(state);
			}
		}
	};
	/**
	* deepFreeze - Freezes all objects found in `subject`.
	* @param  {(Object|Array)} subject               The Object/Array to deeply freeze.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {(Object|Array)}                     The original `subject`.
	*/
	strategies.deepFreeze = {
		interface: function (subject, search = null) {
			return runStrategy(strategies.deepFreeze, dfs, {
				subject: subject,
				search: search
			});
		},
		entry: function (state) {
			Object.freeze(state.subjectRoot);
		},
		main: function (state) {
			if (state.isContainer && state.existing === null) {
				Object.freeze(state.currentValue);
			}
			if (state.isLast) {
				return state.subjectRoot;
			}
		}
	};
	/**
	* deepSeal - Seal all objects found in `subject`.
	* @param  {(Object|Array)} subject               The Object/Array to deeply seal.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {(Object|Array)}                     The original `subject`.
	*/
	strategies.deepSeal = {
		interface: function (subject, search = null) {
			return runStrategy(strategies.deepSeal, dfs, {
				subject: subject,
				search: search
			});
		},
		entry: function (state) {
			Object.seal(state.subjectRoot);
		},
		main: function (state) {
			if (state.isContainer && state.existing === null) {
				Object.seal(state.currentValue);
			}
			if (state.isLast) {
				return state.subjectRoot;
			}
		}
	};
	/**
	* forEach - A simple IOC wrapper to the `dfs` search iterator.
	* @param  {(Object|Array)} subject               The Object/Array to traverse/enumerate.
	* @param  {callback} callback                  The function to invoke per-property of all objects in `subject`.
		* @callback callback
		* @param {Mixed} value                 Equal to `subject[accessor]`.
		* @param {Mixed} accessor              Used to access `subject`.
		* @param {(Object|Array)} subject        The Object/Array being travered/enumerated.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {Mixed}                            Will return anything `callback` returns.
	*/
	strategies.forEach = {
		interface: function (subject, callback, search = null) {
			assert.function(callback, 2);
			return runStrategy(strategies.forEach, dfs, {
				subject: subject,
				search: search,
				callback: callback
			});
		},
		main: runCallback
	};
	/**
	* find - Returns a value if it passes the test, otherwise returns `undefined`.
	* @param  {(Object|Array)} subject               The Object/Array to traverse/enumerate.
	* @param  {callback} callback                  Must return `true` if value passes the test.
		* @callback callback
		* @param {Mixed} value                 Equal to `subject[accessor]`.
		* @param {Mixed} accessor              Used to access `subject`.
		* @param {(Object|Array)} subject        The Object/Array being travered/enumerated.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {Boolean}                          A value that passes the test in `callback`.
	*/
	strategies.find = {
		interface: function (subject, callback, search = null) {
			assert.function(callback, 2);
			return runStrategy(strategies.find, dfs, {
				subject: subject,
				search: search,
				callback: callback
			});
		},
		main: function (state) {
			if (runCallback(state)) {
				return state.currentValue;
			}
		}
	};
	/**
	* some - Returns `true` if at least one value passes the test, otherwise returns `false`.
	* @param  {(Object|Array)} subject               The Object/Array to traverse/enumerate.
	* @param  {callback} callback                  Must return `true` if value passes the test.
		* @callback callback
		* @param {Mixed} value                 Equal to `subject[accessor]`.
		* @param {Mixed} accessor              Used to access `subject`.
		* @param {(Object|Array)} subject        The Object/Array being travered/enumerated.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {Boolean}                          Indicates if at least one value passed the test.
	*/
	strategies.some = {
		interface: function (subject, callback, search = null) {
			assert.function(callback, 2);
			return runStrategy(strategies.some, dfs, {
				subject: subject,
				search: search,
				callback: callback
			});
		},
		main: function (state) {
			if (runCallback(state)) {
				return true;
			}
			if (state.isLast) {
				return false;
			}
		}
	};
	/**
	* every - Returns `true` if all values passes the test, otherwise returns `false`.
	* @param  {(Object|Array)} subject               The Object/Array to traverse/enumerate.
	* @param  {callback} callback                  Must return `true` if value passes the test.
		* @callback callback
		* @param {Mixed} value                 Equal to `subject[accessor]`.
		* @param {Mixed} accessor              Used to access `subject`.
		* @param {(Object|Array)} subject        The Object/Array being travered/enumerated.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {Boolean}                          Indicates if all values passed the test.
	*/
	strategies.every = {
		interface: function (subject, callback, search = null) {
			assert.function(callback, 2);
			return runStrategy(strategies.every, dfs, {
				subject: subject,
				search: search,
				callback: callback
			});
		},
		main: function (state) {
			if (!runCallback(state)) {
				return false;
			}
			if (state.isLast) {
				return true;
			}
		}
	};
	/**
	* map - Clones `subject`, using the return values of `callback`, which is executed once for each primitive element.
	* @param  {(Object|Array)} subject               The Object/Array to traverse/enumerate.
	* @param  {callback} callback                  The callback with which to process values.
		* @callback callback
		* @param {Mixed} value                 Equal to `subject[accessor]`.
		* @param {Mixed} accessor              Used to access `subject`.
		* @param {(Object|Array)} subject        The Object/Array being travered/enumerated.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {(Object|Array)}                     A clone of `subject`.
	*/
	strategies.map = {
		interface: function (subject, callback, search = null) {
			assert.function(callback, 2);
			return runStrategy(strategies.map, dfs, {
				subject: subject,
				search: search,
				callback: callback
			});
		},
		entry: strategies.clone.entry,
		main: function (state) {
			if (state.isContainer) {
				strategies.clone.main(state);
			} else {
				state.tuple.clone[state.accessor] = runCallback(state);
			}
			if (state.isLast) {
				return state.cloneRoot;
			}
		}
	};
	/**
	* nodePaths - Creates a record of the tree paths present within `subject`, ignoring primitives.
	* @param {(Object|Array)} subject               The Object/Array to record paths of.
	* @param {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns {Array}                            An array containing arrays, each representing nodes in a path.
	*/
	strategies.nodePaths = {
		interface: function (subject, search = null) {
			return runStrategy(strategies.nodePaths, bfs, {
				subject: subject,
				search, search
			});
		},
		entry: function (state) {
			// Keeps track of node (object) paths only
			state.nodePaths = [];
			state.nonTraversedNodePaths = [];
			state.additions = 0;
			state.inRoot = true;
		},
		main: function (state) {
			if (state.iterations === 0) {
				if (!state.isFirst) {
					state.inRoot = false;
				}
				if (state.inRoot) {
					state.currentPath = [];
				} else {
					state.pathAccessor = (state.nodePaths.length - 1) - state.additions;
					state.currentPath = state.nodePaths[state.pathAccessor];
				}
				state.additions--;
			}
			if (state.traverse) {
				var newPath = Array.from(state.currentPath);
				newPath.push(state.accessor);
				state.nodePaths.push(newPath);
				state.additions++;
			} else if (state.isContainer && state.existing !== null) {
				var newPath = Array.from(state.currentPath);
				newPath.push(state.accessor);
				state.nonTraversedNodePaths.push(newPath);
			}
			if (state.isLast) {
				return state.nodePaths.concat(state.nonTraversedNodePaths);
			}
		}
	};
	/**
	* paths - Creates a record of the tree paths present within `subject`, including primitives.
	* @param {(Object|Array)} subject               The Object/Array to record paths of.
	* @param {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns {Array}                            An array containing arrays, each representing nodes/primitives in a path.
	*/
	strategies.paths = {
		interface: function (subject, search = null) {
			return runStrategy(strategies.paths, bfs, {
				subject: subject,
				search, search
			});
		},
		entry: function (state) {
			strategies.nodePaths.entry(state);
			// Keeps track of all paths, including primitives
			state.paths = [];
		},
		main: function (state) {
			strategies.nodePaths.main(state);
			state.paths.push(Array.from(state.currentPath));
			state.paths[state.paths.length - 1].push(state.accessor);
			if (state.isLast) {
				return state.paths;
			}
		}
	};
	/**
	* findPath - Creates a record of the first found tree path to `findValue` if found within `subject`, or returns `null`.
	* @param {(Object|Array)} subject               The Object/Array to search for `findValue`.
	* @param {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns {(Array|null)}                       An array containing arrays, each representing nodes in a path.
	*/
	strategies.findPath = {
		interface: function (subject, findValue, search = null) {
			return runStrategy(strategies.findPath, bfs, {
				subject: subject,
				search: search,
				findValue: findValue
			});
		},
		entry: strategies.paths.entry,
		main: function (state) {
			strategies.paths.main(state);
			if (state.currentValue === state.parameters.findValue) {
				return state.paths[state.paths.length > 1 ? state.paths.length - 1 : 0];
			}
			if (state.isLast) {
				return null;
			}
		}
	};
	/**
	* findPaths - Creates a record of all of the tree paths to `findValue` if found within `subject`, or returns `null`.
	* @param {(Object|Array)} subject               The Object/Array to search for `findValue`.
	* @param {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns {(Array|null)}                       An array containing arrays, each representing nodes in a path.
	*/
	strategies.findPaths = {
		interface: function (subject, findValue, search = null) {
			return runStrategy(strategies.findPaths, bfs, {
				subject: subject,
				search: search,
				findValue: findValue
			});
		},
		entry: function (state) {
			strategies.paths.entry(state);
			state.foundPaths = [];
		},
		main: function (state) {
			strategies.paths.main(state);
			if (state.currentValue === state.parameters.findValue) {
				state.foundPaths.push(state.paths[state.paths.length > 0 ? state.paths.length - 1 : 0]);
			}
			if (state.isLast) {
				return state.foundPaths.length > 0 ? state.foundPaths : null;
			}
		}
	};
	/**
	* findShortestPath - Creates a record of the shortest tree path to `findValue` if found within `subject`, or returns `null`.
	* @param {(Object|Array)} subject               The Object/Array to search for `findValue`.
	* @param {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns {(Array|null)}                       An array containing arrays, each representing nodes in a path.
	*/
	strategies.findShortestPath = {
		interface: function (subject, findValue, search = null) {
			return runStrategy(strategies.findShortestPath, bfs, {
				subject: subject,
				search: search,
				findValue: findValue
			});
		},
		entry: function (state) {
			strategies.paths.entry(state);
			state.depthLimit = Infinity;
			state.shortestDepth = Infinity;
			state.shortestPath = null;
		},
		main: function (state) {
			strategies.paths.main(state);
			if (state.isContainer && state.currentPath !== null && state.currentPath.length > state.depthLimit) {
				state.traverse = false;
			}
			if (state.currentValue === state.parameters.findValue) {
				state.depthLimit = state.currentPath.length;
				if (state.currentPath.length < state.shortestDepth) {
					state.shortestDepth = state.currentPath.length;
					state.shortestPath = state.paths[state.paths.length - 1];
				}
			}
			if (state.isLast) {
				return state.shortestPath;
			}
		}
	};
	/**
	* diffPaths - Creates a record of tree paths in `subject` which differ from the tree paths of `compare`.
	* @param  {(Object|Array)} subject               The first Object/Array to compare, and record paths from.
	* @param  {(Object|Array)} compare               The second Object/Array to compare.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {Array}                            An array containing arrays, each representing nodes in a path.
	*/
	strategies.diffPaths = {
		interface: function (subject, compare, search = null) {
			return runStrategy(strategies.diffPaths, bfs, {
				subject: subject,
				compare: compare,
				search: search
			});
		},
		entry: function (state) {
			strategies.diff.entry(state);
			strategies.paths.entry(state);
			state.diffPaths = [];
		},
		main: function (state) {
			strategies.paths.main(state);
			if (strategies.diff.main(state)) {
				state.diffPaths.push(state.paths[state.paths.length - 1]);
			}
			if (state.isLast) {
				return state.diffPaths;
			}
		}
	};
	/**
	* filter - Clones the parts of `subject` which pass the test.
	* @param  {(Object|Array)} subject               The Object/Array to traverse/enumerate.
	* @param  {callback} callback                  Must return `true` if value passes the test.
		* @callback callback
		* @param {Mixed} value                 Equal to `subject[accessor]`.
		* @param {Mixed} accessor              Used to access `subject`.
		* @param {(Object|Array)} subject        The Object/Array being travered/enumerated.
	* @param  {(Object|Array|null)} [search = null]  An optional search index, acting as a traversal whitelist.
	* @returns  {(Object|Array)}                     A clone of `subject`, only containing values which pass the test.
	*/
	strategies.filter = {
		interface: function (subject, callback, search = null) {
			assert.function(callback, 2);
			return runStrategy(strategies.filter, bfs, {
				subject: subject,
				search: search,
				callback: callback
			});
		},
		entry: function (state) {
			strategies.clone.entry(state);
			strategies.paths.entry(state);
			state.pendingPaths = [];
		},
		main: function (state) {
			strategies.paths.main(state);
			if (!state.isContainer && runCallback(state)) {
				if (state.isSecond) {
					state.pendingPaths.push([]);
				} else if (!state.isFirst) {
					state.pendingPaths.push(Array.from(state.currentPath));
				}
				state.pendingPaths[state.pendingPaths.length - 1].push(state.accessor);
			}
			if (state.isLast) {
				while (state.pendingPaths.length > 0) {
					var path = state.pendingPaths.shift();
					var nodeQueue = new Queue();
					nodeQueue.push({
						subject: state.subjectRoot,
						clone: state.cloneRoot
					});
					while (path.length > 0 && nodeQueue.length > 0) {
						var accessor = path.shift();
						var tuple = nodeQueue.shift();
						if (!(accessor in tuple.clone)) {
							if (path.length === 0) {
								tuple.clone[accessor] = tuple.subject[accessor];
							} else {
								tuple.clone[accessor] = createContainer(tuple.subject[accessor]);
							}
						}
						if (path.length === 0) {
							continue;
						}
						var nextTuple = {};
						for (var unit in tuple) {
							nextTuple[unit] = tuple[unit][accessor];
						}
						nodeQueue.push(nextTuple);
					}
				}
				return state.cloneRoot;
			}
		}
	}
	// Modules to Reveal
	var publicModules = {
		dfs: dfs,
		bfs: bfs,
		getContainerLength: getContainerLength,
		isContainer: isContainer
	};
	// Automatically Reveal Strategy Interfaces
	for (var acc in strategies) {
		publicModules[acc] = strategies[acc].interface;
	}
	return publicModules;
})();
// NodeJS `require` compatibility
if (typeof module !== "undefined") {
	module.exports = differentia;
}