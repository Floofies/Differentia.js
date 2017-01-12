/*
Differentia.js
Object Diffing & Cloning Library
https://github.com/Floofies/Differentia.js
*/
var differentia = (function () {
  var d = {
    // Returns `true` if `obj` is an Array or Object, or `false` if otherwise.
    isContainer: function (obj) {
      return (d.isObject(obj) || Array.isArray(obj)) ? true : false;
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
      if (d.isInArray(typeof(obj), ["string", "boolean", "number", "symbol"])) {
        return true;
      } else {
        return false;
      }
    },

    // Creates a new empty Array/Object matching the type of `obj`.
    // Returns an empty Array is `obj` is an Array, or an empty Object if `obj` is an Object.
    // If `obj` is not a container, returns `false`.
    newContainer: function (obj) {
      return d.isObject(obj) ? new Object() : Array.isArray(obj) ? new Array() : false;
    },

    // Returns `true` if `value` is found in `array`, or `false` if otherwise.
    // `start` Number: Which Index to start from.
    // Returns `false` if `start` is outside the Index range of `array`.
    isInArray: function (value, array, start = 0) {
      if (typeof(start) === "number" && array.hasOwnProperty(start)) {
        return array.indexOf(value, start) !== -1 ? true : false;
      } else {
        return false;
      }
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

    // Enumerate through an Object or Array.
    // Executes a callback for each Property or Index.
    forEach: function (obj, callback) {
      if (d.isObject(obj)) {
        if (Object.keys(obj).length > 0) {
          for (var prop in obj) {
            var output = callback(prop, obj[prop]);
            if (output) {
              return output;
            }
          }
        }
      } else if (Array.isArray(obj)) {
        if (obj.length > 0) {
          var count = obj.length > 0 ? obj.length - 1 : 0;
          for (var i = 0; i <= count; i++) {
            var output = callback(i, obj[i]);
            if (output) {
              return output;
            }
          }
        }
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

    // Create a deep clone of an Object or Array
    clone: function (obj, search = false) {
      if (d.isContainer(obj)) {
        // Clone an Object or Array.
        var objClone = d.newContainer(obj);
        if (!search || d.isContainer(search) && d.getLength(search) === 0) {
          search = obj;
        }
        // Traverse the Container and clone it's contents.
        d.forEach(search, function (loc) {
          if (obj.hasOwnProperty(loc)) {
            objClone[loc] = d.clone(obj[loc], search[loc]);
          }
        });
        return objClone;
      } else if (d.isPrimitive(obj)) {
        // Clone a Primitive.
        return d.clonePrimitive(obj);
      }
    },

    // Clone `obj2`'s properties which differ from `obj1`'s.
    // `search` Object or Array: Specific properties to traverse to and diff, ignoring others.
    // Returns cloned `obj2` properties/indexes which differ from `obj1`'s, otherwise an empty Object/Array.
    diffClone: function (obj1, obj2, search = false) {
      if (d.isContainer(obj2)) {
        if (!search || d.isContainer(search) && d.getLength(search) === 0) {
          search = obj2;
        }
        var objClone = d.newContainer(objClone);
        d.forEach(search, function (loc) {
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
        });
        return objClone;
      } else if (d.isPrimitive(obj2) && obj1 !== obj2) {
        return d.clonePrimitive(obj2);
      }
    },

    // Check if `obj2`'s enumerable properties differ in any way from `obj1`'s.
    // `search` Object: Specific properties to traverse to and diff, ignoring others.
    // Returns a `true` if different, or `false` if the same.
    isDiff: function (obj1, obj2, search = false) {
      if (d.isContainer(obj1) && d.isContainer(obj2)) {
        // If search Object not provided, traverse and diff all of `obj2`.
        if (!search || d.isContainer(search) && d.getLength(search) === 0) {
          search = obj2;
        }
        var len1 = d.getLength(obj1);
        var len2 = d.getLength(obj2);
        if (len1 === 0 && len2 === 0) {
          // If both Objects are empty, they are not different.
          return false;
        } else if (!search && len1 !== len2) {
          // Object index/property count does not match, they are different.
          return true;
        } else {
          var traversalResult = d.forEach(search, function(loc) {
            if (obj2.hasOwnProperty(loc)) {
              if (obj1.hasOwnProperty(loc)) {
                return d.isDiff(obj1[loc], obj2[loc], search[loc]) ? true : false;
              } else {
                return true;
              }
            }
          });
          return traversalResult ? true : false;
        }
      } else {
        return obj1 !== obj2;
      }
    }

  };
  return d;
})();
