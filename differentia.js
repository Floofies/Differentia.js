/*
Differentia.js
Object Diffing & Cloning Library
https://github.com/Floofies/Differentia.js
*/
var differentia = (function () {
  // Returns `true` if `obj` is an Array or Object, or `false` if otherwise.
  function isContainer (obj) {
    return (isObject(obj) || Array.isArray(obj)) && !isBlob(obj) ? true : false;
  }

  // Returns `true` if `obj` is a Function, or `false` if otherwise.
  function isFunction (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === "Function" ? true : false;
  }

  // Returns `true` if `obj` is a plain Object, or `false` if otherwise.
  function isObject (obj) {
    return (obj !== null && typeof(obj) === "object" && !Array.isArray(obj)) ? true : false;
  }

  // Returns `true` if `obj` is a Primitive, or `false` if otherwise.
  function isPrimitive (obj) {
    return ["string", "boolean", "number", "symbol"].includes(typeof(obj));
  }

  // Returns `true` if `obj` is a Blob, or `false` if otherwise.
  function isBlob (obj) {
    return (obj instanceof Blob);
  }

  // Returns `true` if `obj` is a Regular Expression, or `false` if otherwise.
  function isRegExp (obj) {
    return (obj instanceof RegExp);
  }

  // Creates a new empty Array/Object matching the type of `obj`.
  // Returns an empty Array if `obj` is an Array, or an empty Object if `obj` is an Object.
  // If `obj` is not a container, returns `false`.
  function newContainer (obj) {
    return isObject(obj) ? new Object() : Array.isArray(obj) ? new Array() : false;
  }

  // Get the number of Object/Array indexes for `obj`, or Primitive characters.
  // Returns `0` if `obj` is not a valid Object
  function getLength (obj) {
    if (isObject(obj)) {
      return Object.keys(obj).length;
    } else if (Array.isArray(obj) || typeof(obj) === "string") {
      return obj.length;
    } else if (typeof(obj) === "number") {
      return obj.toString().length;
    } else {
      return 0;
    }
  }

  // Clones a Primitive
  function clonePrimitive (obj) {
    switch (typeof(obj)) {
      case "string":
      return new String(obj).valueOf();
      break;
      case "boolean":
      return new Boolean(obj).valueOf();
      break;
      case "number":
      return new Number(obj).valueOf();
      break;
    }
  }

  // Clones a Blob
  function cloneBlob (blob) {
    return new Blob([blob], {type: blob.type});
  }

  // Clones a Regular Expression
  function cloneRegExp(regex) {
    return new RegEx(regex.source);
  }

  function searchOk (search) {
    return (search && isContainer(search) && getLength(search) > 0);
  }

  // Iterative deepening depth-first search
  function* dfs (objRoot, searchRoot) {
    if (isContainer(objRoot)) {
      // Unique Node Map
      var nodeMap = new Map();
      // Object Traversal Stack
      var nodeStack = [];
      // Add Root Tuple to Stack
      nodeStack.push({
        search: searchRoot,
        original: objRoot
      });
      // State
      var existing, isContainer, tuple, nextTuple, iterations;
      var isLast = false;
      // Iterate `nodeStack`
      __traverse: while (nodeStack.length > 0) {
        // Pop last item from Stack
        tuple = nodeStack.pop();
        length = getLength(tuple.search);
        iterations = 0;
        // Traverse `search`, iterating through it's properties.
        __iterate: for (var loc in tuple.search) {
          if (loc in tuple.original) {
            iterations++;
            // Existing Object in `nodeMap`
            existing = null;
            // Indicates if iterated property is a container
            isContainer = false;
            if (isContainer(tuple.original[loc])) {
              isContainer = true;
              if (nodeMap.has(tuple.original[loc])) {
                existing = nodeMap.get(tuple.original[loc]);
              }
            } else if (nodeStack.length === 0 && iterations === length) {
              isLast = true;
            }
            try {
              // Yield the Shared State Object
              yield {
                tuple: tuple,
                loc: loc,
                existing: existing,
                isContainer: isContainer,
                isLast: isLast
              };
            } catch (exception) {
              console.group("An error occured while traversing \"" + loc + "\" at node depth " + nodeStack.length + ":");
              console.error(exception);
              console.error("Node Traversal Path:");
              console.error(nodeStack);
              console.groupEnd();
            }
            if (!isLast) {
              // Node has not been seen before, so traverse it
              nextTuple = {};
              // Travese the Tuple's properties
              for (var unit in tuple) {
                nextTuple[unit] = tuple[unit][loc];
              }
              // Save the Tuple to `nodeMap`
              nodeMap.set(tuple.original[loc], nextTuple);
              // Push the next Tuple into the stack
              nodeStack.push(nextTuple);
            }
          }
        }
      }
    } else {
      throw new TypeError("Invalid Parameter 1. Parameter 1 must be an Object or Array");
    }
  }

  // Load a Strategy into the traversl algorithm
  function loadStrategy (strategy, originalRoot, searchRoot) {
    // Initialize the traversal algorithm iterator
    var traversal = strategy.traverseAlg(originalRoot, searchRoot);
    var iteration = traversal.next();
    // Load Shared State Object
    var flyweight = iteration.value;
    // Return Data Variable
    var output;
    // Run Strategy Tuple Initializer
    strategy.init(flyweight);
    // Loop until the iterator is done
    while (!iteration.done) {
      // Execute the Strategy
      output = strategy(flyweight);
      // Return anything the Strategy returns
      if (output || output === null) {
        return output;
      }
      // Continue traversal
      iteration = traversal.next();
      flyweight = iteration.value;
    }
  }

  function Strategy (initCallback, procedureCallback) {
    // Main Procedure Callback
    this.procedure = procedureCallback;
    // Initialization Callback
    this.init = initCallback;
    // Traversal Algorithm
    this.traverseAlg = dfs;
    var self = this;
    // Loads Strategy & Executes Callbacks
    this.run = function (originalRoot, searchRoot) {
      return loadStrategy(self, originalRoot, searchRoot);
    }
  }

  // Create a deep clone of an Object or Array
  function clone (originalRoot, searchRoot = null) {
    if (isContainer(originalRoot)) {
      // Clone an Object or Array.
      var cloneRoot = newContainer(originalRoot);
      // Set Search Object if missing or invalid
      if (!searchOk(searchRoot)) {
        searchRoot = originalRoot;
      } else {
        throw new TypeError("Invalid Parameter 2. Parameter 2 must be an Object or Array");
      }
      var alg = new Strategy(function (state) {
        if (state.done) {
          return cloneRoot;
        }
        var tuple = state.tuple;
        var loc = state.loc;
        var original = tuple.original[loc];
        if (state.isContainer) {
          if (state.existing !== null) {
            tuple.clone[loc] = state.existing.clone;
          } else {
            tuple.clone[loc] = newContainer(original);
          }
        } else if (isPrimitive(original)) {
          // Clone a Primitive.
          tuple.clone[loc] = clonePrimitive(original);
        } else if (isBlob(original)) {
          // Clone a Blob
          tuple.clone[loc] = cloneBlob(original);
        } else if (isRegExp(originl)) {
          // Clone a Regular Expression
          tuple.clone[loc] = cloneRegExp(original);
        }
        if (state.isLast) {
          return cloneRoot;
        }
      });
      alg.init = function (state) {
        // Set Clone Object Root
        state.tuple.clone = cloneRoot;
      };
      return alg.run(originalRoot, searchRoot);
    } else {
      throw new TypeError("Invalid Parameter 1. Parameter 1 must be an Object or Array");
    }
  }

  // Clone `obj2`'s properties which differ from `obj1`'s.
  // `search` Object or Array: Specific properties to traverse to and diff, ignoring others.
  // Returns cloned `obj2` properties/indexes which differ from `obj1`'s, otherwise null.
  function diffClone (subjectRoot, targetRoot, searchRoot = null) {
    if (isContainer(obj2)) {
      if (!searchOk(search)) {
        search = obj2;
      }
      var objClone = newContainer(objClone);
      for (loc in search) {
        if (obj2.hasOwnProperty(loc)) {
          if (obj1.hasOwnProperty(loc)) {
            var diffClone = diffClone(obj1[loc], obj2[loc], search[loc]);
          } else {
            var diffClone = clone(obj2[loc]);
          }
          if (diffClone !== undefined) {
            objClone[loc] = diffClone;
          }
        }
      }
      return objClone;
    } else if (isPrimitive(obj2) && obj1 !== obj2) {
      return clonePrimitive(obj2);
    } else if (isRegExp(obj2) && isDiff(obj1, obj2)) {
      return cloneRegExp(obj2);
    }
  }

  // Check if `obj2`'s enumerable properties differ in any way from `obj1`'s.
  // `search` Object: Specific properties to traverse to and diff, ignoring others.
  // Returns a `true` if different, or `false` if the same.
  function isDiff (obj1, obj2, search = false) {
    if (isContainer(obj1) && isContainer(obj2)) {
      var len1 = getLength(obj1);
      var len2 = getLength(obj2);
      if (len1 === 0 && len2 === 0) {
        // If both Objects are empty, they are not different.
        return false;
      } else if (len1 !== len2) {
        // Object index/property count does not match, they are different.
        return true;
      } else {
        // If search Object not provided, traverse and diff all of `obj2`.
        if (!searchOk(search)) {
          search = obj2;
        }
        var traversalResult = false;
        for (loc in search) {
          if (obj2.hasOwnProperty(loc)) {
            if (obj1.hasOwnProperty(loc)) {
              traversalResult = isDiff(obj1[loc], obj2[loc], search[loc]);
              break;
            } else {
              traversalResult = true;
              break;
            }
          }
        }
        return traversalResult;
      }
    } else if (isPrimitive(obj1) && isPrimitive(obj2)) {
      return obj1 !== obj2;
    } else if (isRegExp(obj1) && isRegExp(obj2)) {
      return (obj1.source !== obj2.source || obj1.ignoreCase !== obj2.ignoreCase || obj1.global !== obj2.global || obj1.multiline !== obj2.multiline);
    } else {
      return obj1 !== obj2;
    }
  }

  // Reveal Modules
  return {
    dft: dft,
    clone: clone,
    diffClone: diffClone,
    isDiff: isDiff
  };
})();
