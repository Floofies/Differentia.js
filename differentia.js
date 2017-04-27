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
        return false;
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

    // Create a deep clone of an Object or Array
    clone: function (originalRoot, searchRoot = false) {
      if (d.isContainer(originalRoot)) {
        // Clone an Object or Array.
        var cloneRoot = d.newContainer(originalRoot);
        // Set Search Object if missing or invalid
        if (!d.searchOk(searchRoot)) {
          searchRoot = originalRoot;
        }
        // Unique Node Map
        var nodeMap = new Map();
        // Object Tuple Traversal Stack
        var nodeStack = {
          stack: [],
          // Depth of the Stack
          depth: 0,
          // Adds a Triad to the Stack
          add: function (original, clone, search) {
            nodeStack.stack.push({
              original: original,
              clone: clone,
              search: search
            });
            nodeStack.depth++;
          },
          // Removes and returns the last item of the Stack, or `null` if the Stack is empty.
          pop: function () {
            if (nodeStack.depth > 0) {
              nodeStack.depth--;
              return nodeStack.stack.pop();
            } else {
              return null;
            }
          },
          // Returns the last item of the Stack, or `null` if the Stack is empty.
          last: function () {
            if (nodeStack.depth > 0) {
              return nodeStack.stack[nodeStack.depth - 1];
            } else {
              return null;
            }
          }
        };
        // Add Root Objects to Stack
        nodeStack.add(originalRoot, cloneRoot, searchRoot);
        // Traverse the Stack
        var triad = null;
        __traverse: while (nodeStack.depth > 0) {
          // Pop last item from Stack
          triad = nodeStack.pop();
          // Traverse `search` and clone `original`'s contents.
          __iterate: for (var loc in triad.search) {
            if (loc in triad.original) {
              if (d.isContainer(triad.original[loc])) {
                if (nodeMap.has(triad.original[loc])) {
                  triad.clone[loc] = nodeMap.get(triad.original[loc]);
                } else {
                  triad.clone[loc] = d.newContainer(triad.original[loc]);
                  nodeMap.set(triad.original[loc], triad.original[loc]);
                  nodeStack.add(triad.original[loc], triad.clone[loc], triad.search[loc]);
                }
              } else {
                triad.clone[loc] = d.clone(triad.original[loc]);
              }
            }
          }
        }
        return cloneRoot;
      } else if (d.isPrimitive(originalRoot)) {
        // Clone a Primitive.
        return d.clonePrimitive(originalRoot);
      } else if (d.isBlob(originalRoot)) {
        // Clone a Blob
        return d.cloneBlob(originalRoot);
      } else if (d.isRegExp(originalRoot)) {
        // Clone a Regular Expression
        return d.cloneRegExp(originalRoot);
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
