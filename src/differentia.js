/*
Differentia.js
JS Object Algorithm Library
https://github.com/Floofies/Differentia.js
*/
if (typeof module === "undefined") {
  var module = { exports: null };
}
var differentia = module.exports = (function () {
  "use strict";
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
      if (errorType !== null && Error.isPrototypeOf(errorType)) {
        throw new errorType(message);
      } else {
        console.error(message);
      }
    }
  }
  // Thunks to `assert` for method argument type checking.
  function assertArgType(boolean, typeString, argName) {
    assert(boolean, "Argument " + argName + " must be " + typeString, TypeError);
  }
  function assertString(input, argName) {
    assertArgType(typeof input === "string", "a String", argName);
  }
  function assertFunction(input, argName) {
    assertArgType(typeof input === "function", "a Function", argName);
  }
  function assertObject(input, argName) {
    assertArgType(typeof input === "object" && !Array.isArray(input), "an Object", argName);
  }
  function assertArray(input, argName) {
    assertArgType(Array.isArray(input), "an Array", argName);
  }
  function assertContainer(input, argName) {
    assertArgType(Array.isArray(input) || typeof input === "object", "an Object or Array", argName);
  }
  // Returns `true` if `obj` is an Array or Object, or `false` if otherwise.
  function isContainer(obj) {
    return (isObject(obj) || Array.isArray(obj));
  }
  // Returns `true` if `obj` is a plain Object, or `false` if otherwise.
  function isObject(obj) {
    return (obj !== null && typeof (obj) === "object" && !Array.isArray(obj));
  }
  // Returns `true` if `obj` is a Primitive, or `false` if otherwise.
  function isPrimitive(obj) {
    if (obj === null) {
      return true;
    }
    return ["string", "boolean", "number", "symbol"].includes(typeof (obj));
  }
  // Returns `true` if `obj` is a Regular Expression, or `false` if otherwise.
  function isRegExp(obj) {
    return (obj instanceof RegExp);
  }
  // Creates a new empty Array/Object matching the type of `obj`.
  // Returns an empty Array if `obj` is an Array, or an empty Object if `obj` is an Object.
  // If `obj` is not a container, returns `false`.
  function newContainer(obj) {
    return isObject(obj) ? new Object() : Array.isArray(obj) ? new Array() : null;
  }
  // Get the number of Object/Array indexes for `obj`, or Primitive characters.
  // Returns `0` if `obj` is not a valid Object
  function getContainerLength(obj) {
    if (obj === null) {
      return 0;
    }
    if (Array.isArray(obj)) {
      return obj.length;
    }
    if (typeof obj === "object") {
      return Object.keys(obj).length;
    }
    return 0;
  }
  function createIterationState() {
    return {
      skipNode: false,
      tuple: {},
      existing: null,
      isContainer: false,
      isArray: false,
      noIndex: false,
      length: 0,
      iterations: 0,
      isLast: false,
      isFirst: true,
      accessor: null
    };
  }
  // Iterative deepening depth-first search
  function* iddfs(subjectRoot, searchRoot = null) {
    // State
    var state = createIterationState();
    if (searchRoot === null) {
      searchRoot = subjectRoot;
    }
    assertContainer(subjectRoot, 1);
    assertArgType(isContainer(searchRoot) && getContainerLength(searchRoot) > 0, "a non-empty Object or Array.", 2);
    if (searchRoot === subjectRoot) {
      state.noIndex = true;
    }
    state.subjectRoot = subjectRoot;
    state.searchRoot = searchRoot;
    // Unique Node Map
    var nodeMap = new Map();
    // Object Traversal Stack
    var nodeStack = [];
    // Add Root Tuple to Stack
    nodeStack[0] = {
      search: searchRoot,
      subject: subjectRoot
    };
    nodeMap.set(state.searchRoot, nodeStack[0]);
    if (subjectRoot === searchRoot) {
      state.noIndex = true;
    }
    // Iterate `nodeStack`
    _traverse: while (nodeStack.length > 0) {
      // Pop last item from Stack
      state.tuple = nodeStack.pop();
      state.length = getContainerLength(state.tuple.search);
      if (Array.isArray(state.tuple.search)) {
        state.isArray = true;
      } else {
        state.isArray = false;
        var accessors = Object.keys(state.tuple.search);
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
        if (state.isContainer) {
          if (nodeMap.has(state.tuple.search[state.accessor])) {
            // This object has been seen before, so retrieve the previously saved tuple.
            state.existing = nodeMap.get(state.tuple.search[state.accessor]);
            state.skipNode = true;
          } else {
            state.existing = null;
          }
        }
        if ((!state.isContainer || state.skipNode) && (state.iterations === state.length - 1 && nodeStack.length === 0)) {
          // The nodeStack is empty and we know we will not traverse or iterate again
          state.isLast = true;
        }
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
        if (state.skipNode) {
          state.skipNode = false;
          continue _iterate;
        }
        if (!state.isContainer || (!state.noIndex && !(state.accessor in state.tuple.subject))) {
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
  function runStrategy(strategy, parameters) {
    assertObject(strategy, 1);
    assert("main" in strategy, "Parameter 1 must have a \"main\" property.", TypeError);
    assertObject(parameters, 2);
    assert("subjectRoot" in parameters, "Parameter 2 must have a \"subjectRoot\" property.", TypeError);
    // Initialize search algorithm.
    var iterator = iddfs(parameters.subjectRoot, parameters.searchRoot);
    var iteration = iterator.next();
    var state = iteration.value;
    // Save parameters in a place the strategy can use them.
    state.parameters = parameters;
    // Run preparatory steps
    if ("entry" in strategy) {
      strategy.entry(state);
    }
    var returnValue;
    // Run the strategy, return if the strategy returns.
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
      state.cloneRoot = newContainer(state.tuple.subject);
      state.tuple.clone = state.cloneRoot;
    },
    main: function (state) {
      if (state.isContainer) {
        if (state.existing !== null) {
          state.tuple.clone[state.accessor] = state.existing.clone;
        } else {
          state.tuple.clone[state.accessor] = newContainer(state.tuple.subject[state.accessor]);
        }
      } else if (isPrimitive(state.tuple.subject[state.accessor])) {
        // Clone a Primitive.
        state.tuple.clone[state.accessor] = state.tuple.subject[state.accessor];
      } else if (isRegExp(state.tuple.subject)) {
        // Clone a Regular Expression
        state.tuple.clone[state.accessor] = new RegEx(state.tuple.subject[state.accessor].source);
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
      if ("compare" in state.tuple && state.accessor in state.tuple.compare) {
        var subjectProp = state.tuple.subject[state.accessor];
        var compareProp = state.tuple.compare[state.accessor];
      } else {
        return true;
      }
      if (((state.noIndex && state.isContainer) || (isContainer(subjectProp)) && isContainer(compareProp))) {
        if (state.noIndex && getContainerLength(compareProp) !== getContainerLength(subjectProp)) {
          // Object index/property count does not match, they are different.
          return true;
        }
      } else if ((isPrimitive(subjectProp) && isPrimitive(compareProp)) && subjectProp !== compareProp) {
        return true;
      } else if ((isRegExp(subjectProp) && isRegExp(compareProp))
        && (subjectProp.source !== compareProp.source
          || subjectProp.ignoreCase !== compareProp.ignoreCase
          || subjectProp.global !== compareProp.global
          || subjectProp.multiline !== compareProp.multiline)) {
        return true;
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
  strategies.forEach = {
    interface: function (subject, callback, search = null) {
      return runStrategy(strategies.forEach, {
        subjectRoot: subject,
        searchRoot: search,
        callback: callback
      });
    },
    main: function (state) {
      return state.parameters.callback(state.tuple.subject[state.accessor], state.accessor, state.tuple.subject);
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
        Object.freeze(state.tuple.subject[state.accessor]);
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
        Object.seal(state.tuple.subject[state.accessor]);
      }
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
        return state.tuple.subject[state.accessor];
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
  return {
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
})();
