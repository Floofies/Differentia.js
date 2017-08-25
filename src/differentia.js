/*
Differentia.js
JS Object Algorithm Library
https://github.com/Floofies/Differentia.js
*/
var differentia = (function () {
  "use strict";
  if (typeof module === "undefined") {
    var module = { exports: null };
  }
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
   * @param {Object|Array} input   An Object or Array.
   * @returns {Object|Array|null}
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
   * @param {Object|Array} input
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
   * iddfs - An iterator implementation of Iterative Deepening Depth-First Search
   *  Returns an Iterator usable with `next()`.
   * @param {Object|Array} subjectRoot             The Object/Array to access.
   * @param {Object|Array|null} [searchRoot=null]  The Object/Array used to target accessors in `subject`
   * @returns {Iterator}
   */
  function* iddfs(subject, search = null) {
    assert.container(subject, 1);
    assert.argType(search === null || (isContainer(search) && getContainerLength(search) > 0), "a non-empty Object or Array", 2);
    var state = {
      traverse: true,
      tuple: {},
      existing: null,
      isContainer: false,
      isArray: false,
      noIndex: false,
      length: 0,
      iterations: 0,
      isLast: false,
      isFirst: true,
      accessor: null,
      currentValue: null
    };
    if (search === null) {
      search = subject;
      state.noIndex = true;
    }
    state.subjectRoot = subject;
    state.searchRoot = search;
    // Unique Node Map
    var nodeMap = new Map();
    // Object Traversal Stack
    var nodeStack = [];
    // Add Root Tuple to Stack
    nodeStack[0] = {
      search: search,
      subject: subject
    };
    nodeMap.set(state.searchRoot, nodeStack[0]);
    // Iterate `nodeStack`
    _traverse: while (nodeStack.length > 0) {
      // Pop last item from Stack
      state.tuple = nodeStack.pop();
      state.isArray = Array.isArray(state.tuple.search);
      if (!state.isArray) {
        var accessors = Object.keys(state.tuple.search);
        state.length = accessors.length;
      } else {
        state.length = state.tuple.search.length;
      }
      // Traverse `search`, iterating through it's properties.
      _iterate: for (
        state.iterations = 0;
        state.accessor = state.isArray ? state.iterations : accessors[state.iterations],
        state.iterations < state.length;
        state.iterations++
      ) {
        if (state.tuple.search[state.accessor] === undefined) {
          continue _iterate;
        }
        // Indicates if iterated property is a container
        state.isContainer = isContainer(state.tuple.search[state.accessor]);
        state.existing = state.isContainer ? nodeMap.get(state.tuple.search[state.accessor]) : null;
        if (state.existing === undefined) {
          state.existing = null;
        }
        // If the value is a container, hasn't been seen before, and has enumerables, then we can traverse it.
        state.traverse = state.isContainer && state.existing === null && getContainerLength(state.tuple.search[state.accessor]) > 0;
        // If the value can't be traversed, nodeStack is empty, and we are on the last enumerable, we know we're on the last iteration.
        // I call this "Terminating Tail-Edge Preemption" since the generator will terminate after this last yield.
        state.isLast = (!state.isContainer || !state.traverse) && (state.iterations === state.length - 1 && nodeStack.length === 0);
        state.currentValue = state.tuple.subject[state.accessor];
        try {
          // Yield the Shared State Object
          yield state;
        } catch (exception) {
          console.group("An error occured while traversing \"" + loc + "\" at node depth " + nodeStack.length + ":");
          console.error(exception);
          console.log("Node Traversal Stack:");
          console.error(nodeStack);
          console.groupEnd();
        }
        if (state.isFirst) {
          state.isFirst = false;
        }
        if (!state.isContainer || !state.traverse || (!state.noIndex && !(state.accessor in state.tuple.subject))) {
          continue _iterate;
        }
        // Node has not been seen before, so traverse it
        var nextTuple = {};
        // Travese the Tuple's properties
        for (var unit in state.tuple) {
          if (unit === "search" || unit === "subject" || state.accessor in state.tuple[unit]) {
            nextTuple[unit] = state.tuple[unit][state.accessor];
          }
        }
        // Save the Tuple to `nodeMap`
        nodeMap.set(state.tuple.search[state.accessor], nextTuple);
        // Push the next Tuple into the stack
        nodeStack[nodeStack.length] = nextTuple;
      }
    }
  }
  /**
   * runStrategy - Calls `strategy.entry` and `strategy.main` with the state of the iddfs iterator.
   *  `strategy.entry` is optional. It is only executed once, for the first value the iterator yields.
   * @param {Object} strategy    An Object containing an optional `entry` property and a required `main` property.
   * @param {Object} parameters  An Object containing required `subjectRoot` and `searchRoot` properties.
   * @returns {Mixed}            Returns anything `strategy.main` returns.
   */
  function runStrategy(strategy, parameters) {
    assert.object(strategy, 1);
    assert("main" in strategy, "Parameter 1 must have a \"main\" property.", TypeError);
    assert.object(parameters, 2);
    assert("subjectRoot" in parameters, "Parameter 2 must have a \"subjectRoot\" property.", TypeError);
    // Initialize search algorithm.
    var iterator = iddfs(parameters.subjectRoot, parameters.searchRoot);
    var iteration = iterator.next();
    var state = iteration.value;
    // Save parameters in a prop the strategy can see
    state.parameters = parameters;
    // Run preparatory function
    if ("entry" in strategy) {
      strategy.entry(state);
    }
    var returnValue;
    // Run the strategy, return what the strategy returns.
    while (!iteration.done) {
      returnValue = strategy.main(state);
      if (returnValue !== undefined) {
        return returnValue;
      }
      iteration = iterator.next();
      state = iteration.value;
    }
  }
  const strategies = {};
  strategies.clone = {
    interface: function (subject, search = null) {
      return runStrategy(strategies.clone, {
        subjectRoot: subject,
        searchRoot: search
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
  strategies.diff = {
    interface: function (subject, compare, search = null) {
      if (search === null && getContainerLength(subject) !== getContainerLength(compare)) {
        return true;
      }
      return runStrategy(strategies.diff, {
        subjectRoot: subject,
        compareRoot: compare,
        searchRoot: search
      });
    },
    entry: function (state) {
      state.tuple.compare = state.parameters.compareRoot;
    },
    main: function (state) {
      if (!("compare" in state.tuple) && !(state.accessor in state.tuple.compare)) {
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
  strategies.diffClone = {
    interface: function (subject, compare, search = null) {
      return runStrategy(strategies.diffClone, {
        subjectRoot: subject,
        compareRoot: compare,
        searchRoot: search
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
  strategies.deepFreeze = {
    interface: function (subject, search = null) {
      return runStrategy(strategies.deepFreeze, {
        subjectRoot: subject,
        searchRoot: search
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
  strategies.deepSeal = {
    interface: function (subject, search = null) {
      return runStrategy(strategies.deepSeal, {
        subjectRoot: subject,
        searchRoot: search
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
  strategies.forEach = {
    interface: function (subject, callback, search = null) {
      return runStrategy(strategies.forEach, {
        subjectRoot: subject,
        searchRoot: search,
        callback: callback
      });
    },
    main: function (state) {
      return state.parameters.callback(state.currentValue, state.accessor, state.tuple.subject);
    }
  };
  strategies.find = {
    interface: function (subject, callback, search = null) {
      return runStrategy(strategies.find, {
        subjectRoot: subject,
        searchRoot: search,
        callback: callback
      });
    },
    main: function (state) {
      if (strategies.forEach.main(state)) {
        return state.currentValue;
      }
    }
  };
  strategies.some = {
    interface: function (subject, callback, search = null) {
      return runStrategy(strategies.some, {
        subjectRoot: subject,
        searchRoot: search,
        callback: callback
      });
    },
    main: function (state) {
      if (strategies.forEach.main(state)) {
        return true;
      }
      if (state.isLast) {
        return false;
      }
    }
  };
  strategies.every = {
    interface: function (subject, callback, search = null) {
      return runStrategy(strategies.every, {
        subjectRoot: subject,
        searchRoot: search,
        callback: callback
      });
    },
    main: function (state) {
      if (!strategies.forEach.main(state)) {
        return false;
      }
      if (state.isLast) {
        return true;
      }
    }
  };
  // Reveal Modules
  module.exports = {
    getContainerLength: getContainerLength,
    isContainer: isContainer,
    iddfs: iddfs,
    clone: strategies.clone.interface,
    diff: strategies.diff.interface,
    diffClone: strategies.diffClone.interface,
    forEach: strategies.forEach.interface,
    deepFreeze: strategies.deepFreeze.interface,
    deepSeal: strategies.deepSeal.interface,
    find: strategies.find.interface,
    some: strategies.some.interface,
    every: strategies.every.interface
  };
  return module.exports;
})();
