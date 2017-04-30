/*
Differentia.js
Object Diffing & Cloning Library
https://github.com/Floofies/Differentia.js
*/
var differentia = (function () {
  var d = {
    // Returns `true` if `obj` is an Array or Object, or `false` if otherwise.
    isContainer: function (obj) {
      return (d.isObject(obj) || Array.isArray(obj)) && !d.isBlob(obj) ? true : false;
    },

    // Returns `true` if `obj` is a Function, or `false` if otherwise.
    isFunction: function (obj) {
      return Object.prototype.toString.call(obj).slice(8, -1) === "Function" ? true : false;
    },

    // Returns `true` if `obj` is a plain Object, or `false` if otherwise.
    isObject: function (obj) {
      return (obj !== null && typeof(obj) === "object" && !Array.isArray(obj)) ? true : false;
    },

    // Returns `true` if `obj` is a Primitive, or `false` if otherwise.
    isPrimitive: function (obj) {
      return ["string", "boolean", "number", "symbol"].includes(typeof(obj));
    },

    // Returns `true` if `obj` is a Blob, or `false` if otherwise.
    isBlob: function (obj) {
      return (obj instanceof Blob);
    },

    // Returns `true` if `obj` is a Regular Expression, or `false` if otherwise.
    isRegExp: function (obj) {
      return (obj instanceof RegExp);
    },

    // Creates a new empty Array/Object matching the type of `obj`.
    // Returns an empty Array if `obj` is an Array, or an empty Object if `obj` is an Object.
    // If `obj` is not a container, returns `false`.
    newContainer: function (obj) {
      return d.isObject(obj) ? new Object() : Array.isArray(obj) ? new Array() : false;
    },

    // Get the number of Object/Array indexes for `obj`, or Primitive characters.
    // Returns `0` if `obj` is not a valid Object
    getLength: function (obj) {
      if (d.isObject(obj)) {
        return Object.keys(obj).length;
      } else if (Array.isArray(obj) || typeof(obj) === "string") {
        return obj.length;
      } else if (typeof(obj) === "number") {
        return obj.toString().length;
      } else {
        return 0;
      }
    },

    // Clones a Primitive
    clonePrimitive: function (obj) {
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
    },

    // Clones a Blob
    cloneBlob: function (blob) {
      return new Blob([blob], {type: blob.type});
    },

    // Clones a Regular Expression
    cloneRegExp: function (regex) {
      return new RegEx(regex.source);
    },

    searchOk: function (search) {
      return (search && d.isContainer(search) && d.getLength(search) > 0);
    },

    // Iterative deepening depth-first traversal
    dft: function* (objRoot, searchRoot) {
      if (d.isContainer(objRoot)) {
        // Unique Node Map
        var nodeMap = new Map();
        // Object Traversal Stack
        var nodeStack = [];
        // Add Root Object to Stack
        nodeStack.push({
          search: searchRoot,
          original: objRoot
        });
        // Shared State Object
        var flyweight = null;
        var existing, isContainer, tuple, nextTuple;
        // Iterate `nodeStack`
        __traverse: while (nodeStack.length > 0) {
          // Pop last item from Stack
          tuple = nodeStack.pop();
          // Traverse `search`, iterating through it's properties.
          __iterate: for (var loc in tuple.search) {
            if (loc in tuple.original) {
              // Existing Object in `nodeMap`
              existing = null;
              // Indicates if iterated property is a container
              isContainer = false;
              if (d.isContainer(tuple.original[loc])) {
                isContainer = true;
                if (nodeMap.has(tuple.original[loc])) {
                  existing = nodeMap.get(tuple.original[loc]);
                }
              }
              try {
                // Yield the Shared State Object
                yield {
                  loc: loc,
                  tuple: tuple,
                  existing: existing,
                  isContainer: isContainer
                };
              } catch (exception) {
                console.group("An error occured while traversing \"" + loc + "\" at node depth " + nodeStack.length + ":");
                console.error(exception);
                console.error("Node Traversal Path:");
                console.error(nodeStack);
                console.groupEnd();
              }
              if (isContainer && existing === null) {
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
    },

    // Create a deep clone of an Object or Array
    clone: function (originalRoot, searchRoot = null) {
      if (d.isContainer(originalRoot)) {
        // Clone an Object or Array.
        var cloneRoot = d.newContainer(originalRoot);
        // Set Search Object if missing or invalid
        if (!d.searchOk(searchRoot)) {
          searchRoot = originalRoot;
        } else {
          throw new TypeError("Invalid Parameter 2. Parameter 2 must be an Object or Array");
        }
        // Traverse `search`, iterating through it's properties as accessors to `original`, cloning `original`'s properties' into `clone`.
        var traversal = d.dft(originalRoot, searchRoot);
        var iteration = traversal.next();
        // Shared State Object
        var flyweight = iteration.value;
        var loc, tuple, existing, isContainer;
        // Set Clone Object Root
        flyweight.tuple.clone = cloneRoot;
        while (!iteration.done) {
          // Unpack the flyweight
          loc = flyweight.loc;
          tuple = flyweight.tuple;
          existing = flyweight.existing;
          isContainer = flyweight.isContainer;
          if (isContainer) {
            if (existing !== null) {
              tuple.clone[loc] = existing.clone;
            } else {
              tuple.clone[loc] = d.newContainer(tuple.original[loc]);
            }
          } else if (d.isPrimitive(tuple.original[loc])) {
              // Clone a Primitive.
              tuple.clone[loc] = d.clonePrimitive(tuple.original[loc]);
            } else if (d.isBlob(tuple.original[loc])) {
              // Clone a Blob
              tuple.clone[loc] = d.cloneBlob(tuple.original[loc]);
            } else if (d.isRegExp(tuple.original[loc])) {
              // Clone a Regular Expression
              tuple.clone[loc] = d.cloneRegExp(tuple.original[loc]);
            }
          // Continue traversal
          iteration = traversal.next();
          flyweight = iteration.value;
        }
        return cloneRoot;
      } else {
        throw new TypeError("Invalid Parameter 1. Parameter 1 must be an Object or Array");
      }
    },

    // Clone `obj2`'s properties which differ from `obj1`'s.
    // `search` Object or Array: Specific properties to traverse to and diff, ignoring others.
    // Returns cloned `obj2` properties/indexes which differ from `obj1`'s, otherwise an empty Object/Array.
    diffClone: function (obj1, obj2, search = false) {
      if (d.isContainer(obj2)) {
        if (!d.searchOk(search)) {
          search = obj2;
        }
        var objClone = d.newContainer(objClone);
        for (loc in search) {
          if (obj2.hasOwnProperty(loc)) {
            if (obj1.hasOwnProperty(loc)) {
              var diffClone = d.diffClone(obj1[loc], obj2[loc], search[loc]);
            } else {
              var diffClone = d.clone(obj2[loc]);
            }
            if (diffClone !== undefined) {
              objClone[loc] = diffClone;
            }
          }
        }
        return objClone;
      } else if (d.isPrimitive(obj2) && obj1 !== obj2) {
        return d.clonePrimitive(obj2);
      } else if (d.isRegExp(obj2) && d.isDiff(obj1, obj2)) {
        return d.cloneRegExp(obj2);
      }
    },

    // Check if `obj2`'s enumerable properties differ in any way from `obj1`'s.
    // `search` Object: Specific properties to traverse to and diff, ignoring others.
    // Returns a `true` if different, or `false` if the same.
    isDiff: function (obj1, obj2, search = false) {
      if (d.isContainer(obj1) && d.isContainer(obj2)) {
        var len1 = d.getLength(obj1);
        var len2 = d.getLength(obj2);
        if (len1 === 0 && len2 === 0) {
          // If both Objects are empty, they are not different.
          return false;
        } else if (len1 !== len2) {
          // Object index/property count does not match, they are different.
          return true;
        } else {
          // If search Object not provided, traverse and diff all of `obj2`.
          if (!d.searchOk(search)) {
            search = obj2;
          }
          var traversalResult = false;
          for (loc in search) {
            if (obj2.hasOwnProperty(loc)) {
              if (obj1.hasOwnProperty(loc)) {
                traversalResult = d.isDiff(obj1[loc], obj2[loc], search[loc]);
                break;
              } else {
                traversalResult = true;
                break;
              }
            }
          }
          return traversalResult;
        }
      } else if (d.isPrimitive(obj1) && d.isPrimitive(obj2)) {
        return obj1 !== obj2;
      } else if (d.isRegExp(obj1) && d.isRegExp(obj2)) {
        return (obj1.source !== obj2.source || obj1.ignoreCase !== obj2.ignoreCase || obj1.global !== obj2.global || obj1.multiline !== obj2.multiline);
      } else {
        return obj1 !== obj2;
      }
    }

  };
  return d;
})();
