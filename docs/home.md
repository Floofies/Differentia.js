# Differentia.js

[![NPM](https://www.nodei.co/npm/differentia.png?compact=true)](https://www.npmjs.com/package/differentia)
===
Differentia is a library which provides an advanced suite of Object/Array focused functions. They are all "deep" algorithms, and fully traverse all child Objects/Arrays/properties unless given a search index object with specifies otherwise. Differentia is fully compatible with Node and the browser.

# :closed_book: Documentation

- [Search Algorithm Iterators](#search-algorithm-iterators)
  - [dfs](#dfs)
  - [bfs](#bfs)
- [Search Algorithm Strategies](#main-functions)
  - [clone](#clone)
  - [diffClone](#diffclone)
  - [diff](#diff)
  - [deepFreeze](#deepfreeze)
  - [deepSeal](#deepseal)
  - [nodePaths](#nodepaths)
  - [paths](#paths)
  - [findPath](#findpath)
  - [findPaths](#findpaths)
  - [findShortestPath](#findshortestpath)
  - [diffPaths](#diffpaths)
- [Higher-Order Functions](#higher-order-functions)
  - [forEach](#foreach)
  - [find](#find)
  - [some](#some)
  - [every](#every)
  - [map](#map)
  - [filter](#filter)
- [Data Structures](#data-structures)
  - [BinaryTree](#binarytree)
  - [RedBlackTree](#redblacktree)
  - [LinkedList](#linkedlist)
  - [CircularLinkedList](#circularlinkedlist)
  - [DoubleLinkedList](#doublelinkedlist)
  - [CircularDoubleLinkedList](#circulardoublelinkedlist)

---

## Search Algorithm Iterators

The search iterators, `bfs` and `dfs`, are actually both the same `searchIterator` algorithm (See CONTRIBUTING.md for more details about `searchIterator`) with differing traversal scheduling data structures (Queue VS Stack).

Upon calling `next()`, the search iterators expose a single state object in `value` which encapsulates the current state of iteration/traversal. The object is a flyweight and is thus mutated between every iteration/traversal; because of this, do not attempt to store or otherwise rely on values contained within it for more than one step in the iteration.

Property|Datatype|Description
---|---|---
accessor|Mixed|The accessor being used to access `value.tuple.subject` during property/element enumerations. Equal to `state.accessors[state.iteration]`.
accessors|Array|An Array of enumerable acessors found in `value.tuple.search`.
currentValue|Mixed|The value of the element of enumeration. Equal to `value.tuple.subject[value.accessor]`.
existing|`null` or Object|If `dfs` encounters an Object/Array it has seen before during the same search, this property will be set to the equivalent tuple; otherwise it will be `null`. Objects added to that tuple previously will show up again here.
isContainer|Boolean|Indicates if the current item of the enumeration is an Object or Array.
isFirst|Boolean|Indicates if the current item of the enumeration is the first item to be enumerated.
isLast|Boolean|Indicates if the current item of the enumeration is the last item to be enumerated.
iterations|Number|A number indicating how many items have been enumerated in the current Object/Array. Gets reset to `0` on each traversal.
length|Number|The total number of enumerable properties/elements of the current Object/Array being enumerated.
noIndex|Boolean|Indicates if a search index was not given. If `true`, then `search` is equal/assigned to `subject`.
targetTuples|Array|A list of tuples to be targeted for traversal. Tuples are removed from the bottom-up.
traverse|Boolean|Indicates if the current item of enumeration should be traversed.
tuple|Object|An Object containing all Objects being traversed in parallel.

The `tuple` object contains the following properties:

Property|Datatype|Description
---|---|---
subject|Object/Array|The source of paths/elements for traversal/enumeration.
search|Object/Array|The source of target paths/elements for traversal/enumeration.

Traversal is performed upon this tuple of objects equally, providing they have overlapping/equal paths. If any node exists in `search` that does not exist in any one object of the tuple, then traversal is aborted for that specific object and it is dropped from the tuple; except if the object lacking the node is `subject`, in which case traversal is aborted completely across all objects of the tuple, and nothing is dropped from the tuple.

### `dfs`

*Generator*
```JavaScript
dfs( subject, search = null ] );
```
An implementation of Depth-First Search. Enumerates properties/elements in `subject`, traversing into any Objects/Arrays, using `search` as a search index. Any properties/nodes present in `search` will be used to enumerate, traverse, and access the properties/nodes of `subject`. If a property/node exists in `search` that does not exist in `subject`, or vice versa, it will be skipped.

Upon calling `next()`, the `dfs` iterator exposes a single `value` object which encapsulates the state of iteration/traversal at the time of being returned. The object is a flyweight and is thus mutated between every iteration/traversal; because of this, do not attempt to store or otherwise rely on values contained within it.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `dfs` to traverse and enumerate an Object:</summary>

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

var search = differentia.dfs(subject, subject);

// Starts on the top layer of the root of subject:
var iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings1"
console.log(iteration.value.currentValue); // Logs ["Hello World!"]
iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings2"
console.log(iteration.value.currentValue); // Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw in reverse order:
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Good Morning!"
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Hello World!"
```

</details>

<details><summary>Example 2: Using `dfs` with a search index to traverse and enumerate an Object's *specific* properties:</summary>

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

var search = {
  greetings2: {
    0: null
  }
};

var search = differentia.dfs(subject, search);

// Starts on the top layer of the root of subject:
var iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings2"
console.log(iteration.value.currentValue); // Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw:
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Good Morning!"
```

</details>

---

### `bfs`

*Generator*
```JavaScript
bfs( subject [, search = null ] );
```
An implementation of Breadth-First Search. Enumerates properties/elements in `subject`, traversing into any Objects/Arrays, using `search` as a search index. Any properties/nodes present in `search` will be used to enumerate, traverse, and access the properties/nodes of `subject`. If a property/node exists in `search` that does not exist in `subject`, or vice versa, it will be skipped.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `bfs` to traverse and enumerate an Object:</summary>

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

var search = differentia.bfs(subject, subject);

// Starts on the top layer of the root of subject:
var iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings1"
console.log(iteration.value.currentValue); // Logs ["Hello World!"]
iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings2"
console.log(iteration.value.currentValue); // Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw in-order:
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Hello World"
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Good Morning"
```

</details>

<details><summary>Example 2: Using `bfs` with a search index to traverse and enumerate an Object's *specific* properties:</summary>

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

var search = {
  greetings2: {
    0: null
  }
};

var search = differentia.bfs(subject, search);

// Starts on the top layer of the root of subject:
var iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings2"
console.log(iteration.value.currentValue); // Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw:
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Good Morning!"
```

</details>

---

# Main Functions

### `clone`

*Function*
```JavaScript
clone( subject [, search = null ] );
```
Returns a clone of `subject`. If `search` is provided, the clone will only contain properties/paths that are present in `search`.

#### Supported Data Types
DataType|Supported
---|---
Function|:x:
Symbol|:x:
Blob|:x:
Object|:white_check_mark:
Array|:white_check_mark:
String|:white_check_mark:
Number|:white_check_mark:
Boolean|:white_check_mark:
RegExp|:white_check_mark:

#### Parameters
- **`subject`** Object/Array

  The Object or Array to clone from.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `clone` to clone an object:</summary>

```JavaScript
var subject = {
 string1: "Hello",
 string2: "World!"
};

var clonedObject = differentia.clone(subject);
console.log(clonedObject); // Logs {string1: "Hello", string2: "World!"}
```

</details>

<details><summary>Example 2: Using `clone` with a search index to clone an object's specific properties:</summary>

```JavaScript
var subject = {
 string1: "Hello",
 string2: "World!"
};

var search = {
  string2: null
};

var clonedObject = differentia.clone(subject search);
console.log(clonedObject); // Logs {string2: "World!"}
```

</details>

---

### `diffClone`

*Function*
```JavaScript
diffClone( subject , compared [, search = null ] );
```
Returns a clone of `subject`, containing only the properties which differ from those contained within `compared`.

#### Supported Data Types
DataType|Supported
---|---
Function|:x:
Symbol|:x:
Blob|:x:
Object|:white_check_mark:
Array|:white_check_mark:
String|:white_check_mark:
Number|:white_check_mark:
Boolean|:white_check_mark:
RegExp|:white_check_mark:

#### Parameters

- **`subject`** Object/Array

  The Object or Array to clone from.

- **`compared`** Object/Array

  The Object or Array to compare `subject` to.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `diffClone` to clone an object's differing properties:</summary>

```JavaScript
// The Object to clone from:
var subject = {
 string1: "Hello",
 string2: "Bob",
 string3: "Ross!"
};

// The Object to compare `objectToClone` to:
var compared = {
 string1: "Hello",
 string2: "World!"
};

 var clonedObject = differentia.diffClone(subject, compared);

 /*
 Variable `clonedObject` is now this Object:
 {
  string2: "Bob",
  string3: "Ross!"
 }
 */
 ```
</details>

<details><summary>Example 2: Using `diffClone` with the `search` parameter to clone an object's *specific* differing properties:</summary>

```JavaScript
var subject = {
 string1: "Burn the",
 string2: "Pretty",
 string3: "Little",
 string4: "Trees"
};

var compared = {
 string1: "Hello",
 string2: "World!"
};

// Here, we ignore `string1`.
var search = {
 string2: null,
 string3: null,
 string4: null
};

var clonedObject = differentia.diffClone(subject, compared, search);

/*
Variable `clonedObject` is now this Object:
{
  string2: "Pretty",
  string3: "Little",
  string4: "Trees"
}
*/
```
</details>

---

### `diff`

*Function*
```JavaScript
diff( subject , compared [, search = null ] );
```
Returns `true` if `compared`'s structure, properties, or values differ in any way from `subject`, or `false` if otherwsie.

#### Supported Data Types
DataType|Supported
---|---
Function|:x:
Symbol|:x:
Blob|:x:
Object|:white_check_mark:
Array|:white_check_mark:
String|:white_check_mark:
Number|:white_check_mark:
Boolean|:white_check_mark:
RegExp|:white_check_mark:

#### Parameters
- **`subject`** Object/Array

  The Object or Array to compare `compared` to.

- **`compared`** Object/Array

  The Object or Array to compare to `subject`.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `diff` to see if an Object's enumerable properties differ from another:</summary>

```JavaScript
//
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var compared = {
  string2: "Pretty",
  array1: [
    "Little Branches",
    "Little Leaves"
  ]
};

var doTheyDiffer = differentia.diff(subject, compared);
/*
`doTheyDiffer` is now `true`.
*/
```
</details>

<details><summary>Example 2: Using `diff` with the `search` parameter to diff an object's *specific* differing properties:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var compared = {
  string2: "Pretty",
  array1: [
    "Little Clouds",
    "Autumn Day"
  ]
};

// Here, we ignore index `1` of `array1`.
var search = {
  string1: "",
  array1: [
    0: ""
  ]
};

var doTheyDiffer = differentia.diff(subject, compared, search);
/*
`doTheyDiffer` is now `false`.
*/
```
</details>

---

### `deepFreeze`

*Function*
```JavaScript
deepFreeze( subject [, search = null ] );
```
Traverses and enumerates `subject`, freezing it and it's children. Uses `Object.freeze()`. Returns the frozen Object/Array. The method directly mutates the Object/Array.

#### Parameters
- **`subject`** Object/Array

  The Object or Array to freeze.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `deepFreeze` to freeze all Objects/Arrays:</summary>

```JavaScript
//
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

differentia.deepFreeze(subject);
// All Objects/Arrays within subject, and all it's children, are now frozen.
```
</details>

---

### `deepSeal`

*Function*
```JavaScript
deepFreeze( subject [, search = null ] );
```
Traverses and enumerates `subject`, sealing it and and it's children. Uses `Object.seal()`. Returns the sealed Object/Array. The method directly mutates the Object/Array.

#### Parameters
- **`subject`** Object/Array

  The Object or Array to seal.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `deepSeal` to seal all Objects/Arrays:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

differentia.deepSeal(subject);
// All Objects/Arrays within subject, and all it's children, are now sealed.
```
</details>

___

### `nodePaths`

*Function*
```JavaScript
nodePaths( subject [, search = null ] );
```
Traverses and enumerates `subject`, returning an array listing all paths of the tree, ignoring primitive data types.

#### Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `paths` to record the paths/branches in an Object:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var paths = differentia.paths(subject);

console.log(paths);
/* Logs:
[
  ["array1"]
]
*/
```
</details>

___

### `paths`

*Function*
```JavaScript
paths( subject [, search = null ] );
```
Traverses and enumerates `subject`, returning an array listing all paths of the tree, including primitive data types.

#### Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `paths` to record the paths/branches in an Object:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var paths = differentia.paths(subject);

console.log(paths);
/* Logs:
[
  ["string1"],
  ["array1", "0"],
  ["array1", "1"]
]
*/
```
</details>

___

### `findPath`

*Function*
```JavaScript
findPath( subject, findValue [, search = null ] );
```
Traverses and enumerates `subject`, searching for `findValue`. Returns an Array containing the first found path to `findValue`, or `null` if it was not found.

#### Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`findValue`** Object/Array

  The value to find the path of.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `paths` to record the paths/branches in an Object:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var path = differentia.findPath(subject, "Little Trees");

console.log(path);
/* Logs:
[
  ["array1", "1"]
]
*/
```
</details>

---

### `findPaths`

*Function*
```JavaScript
findPaths( subject, findValue [, search = null ] );
```
Traverses and enumerates `subject`, searching for `findValue`. Returns an Array containing all found paths to `findValue`, or `null` if it was not found.

#### Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`findValue`** Object/Array

  The value to find the path of.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `paths` to record the paths/branches to a value in an Object:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  string2: "Little Trees",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var paths = differentia.findPaths(subject, "Little Trees");

console.log(paths);
/* Logs:
[
  ["string2"],
  ["array1", "1"]
]
*/
```
</details>

---

### `findShortestPath`

*Function*
```JavaScript
findShortestPath( subject, findValue [, search = null ] );
```
Traverses and enumerates `subject`, searching for `findValue`. Returns an Array containing the shortest found path to `findValue`, or `null` if it was not found.

#### Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`findValue`** Object/Array

  The value to find the path of.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `findShortestPath` to record the shortest path/branch to a value in an Object:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  string2: "Little Trees",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var path = differentia.findShortestPath(subject, "Little Trees");

console.log(path);
/* Logs:
["string2"]
*/
```
</details>

---

### `diffPaths`

*Function*
```JavaScript
diffPaths( subject, compare [, search = null ] );
```
Traverses and enumerates `subject`, returning an array listing all paths of the tree which differ from the paths of `compare`.

## Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`compared`** Object/Array

  The Object or Array to compare to `subject`.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
<details><summary>Example 1: Using `paths` to find differing paths/branches:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var compared = {
  string2: "Pretty",
  array1: [
    "Little Branches",
    "Little Leaves"
  ]
};

var differingPaths = differentia.diffPaths(subject, compare);

console.log(differingPaths);
/* Logs:
[
  ["string1"],
  ["array1","0"],
  ["array1","1"]
]
*/
```
</details>

___

# Higher-Order Functions

### `forEach`

*Higher-Order Function*
```JavaScript
forEach( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](#dfs) iterator. `callback` is executed for each element. Unlike `Array.prototype.forEach`, this implementation allows a return value of any type, which will be returned to the caller.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each element.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`**

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`**

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`**

  The Object/Array being enumerated.

#### Examples
<details><summary>Example 1: Using `forEach` to traverse and enumerate an Object:</summary>

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

differentia.forEach(subject, function (currentValue, accessor, subject) {
  console.log(accessor);
  console.log(currentValue);
});

// Starts on the top layer of the root of subject:
// Logs "greetings1"
// Logs ["Hello World!"]
// Logs "greetings2"
// Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw:
// Logs 0
// Logs "Good Morning!"
// Logs 0
// Logs "Hello World!"
```

</details>

---

### `find`

*Higher-Order Function*
```JavaScript
find( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](#dfs) iterator. `callback` is executed for each element. If `callback` returns `true` at any time, then `currentValue` is immediately returned. If `callback` never returns `true`, then `undefined` is returned.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each element.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`** Mixed

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`** Mixed

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`** Object/Array

  The Object/Array being enumerated.

#### Examples
<details><summary>Example 1: Using `find` to find a value in an Object:</summary>

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

// This will find a value.
var foundValue = differentia.find(subject, function (currentValue, accessor, subject) {
  return currentValue === "Good Morning!";
});
console.log(foundValue); // Logs "Good Morning!";

// This will not find a value.
foundValue = differentia.find(subject, function (currentValue, accessor, subject) {
  return currentValue === "This does not exist in the Array!";
});
console.log(foundValue); // Logs undefined;
```

</details>

---

### `some`

*Higher-Order Function*
```JavaScript
some( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](#dfs) iterator. `callback` is executed for each element. If `callback` returns `true` at any time, then `true` is immediately returned. If `callback` never returns `true`, then `false` is returned. You can use this function to test if a least one element of the Object tree passes a test.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each element.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`** Mixed

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`** Mixed

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`** Object/Array

  The Object/Array being enumerated.

#### Examples
<details><summary>Example 1: Using `some` to verify if at least one element in an Object passes a test:</summary>

```JavaScript
var subject = [100, 200, 300, 400, 500];

// This test will pass for at least one value, and will not run more than once.
var passed = differentia.some(subject, function (currentValue, accessor, subject) {
  return currentValue === 300;
});
console.log(passed); // Logs true, at least one test passed.

// This test will fail for all values.
passed = differentia.some(subject, function (currentValue, accessor, subject) {
  return currentValue === 9000;
});
console.log(passed); // Logs false, all tests failed.
```

</details>

---

### `every`

*Higher-Order Function*
```JavaScript
every( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](#dfs) iterator. `callback` is executed for each element. If `callback` returns `false` (or a non-truthy value) at any time, then `false` is immediately returned. If `callback` returns `true` for every element, then `true` is returned. You can use this function to test if all elements of the Object tree pass a test.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each element.

- **`search`** (*Optional*)  Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`** Mixed

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`** Mixed

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`** Object/Array

  The Object/Array being enumerated.

#### Examples
<details><summary>Example 1: Using `every` to verify if all elements in an Object pass a test:</summary>

```JavaScript
var subject = [100, 200, 300, 400, 500];

// This test will pass for all values.
var passed = differentia.every(subject, function (currentValue, accessor, subject) {
  return currentValue >= 100;
});
console.log(passed); // Logs true, all tests passed.

// This test will fail for the first value, and will not run more than once.
passed = differentia.every(subject, function (currentValue, accessor, subject) {
  return currentValue === 9000;
});
console.log(passed); // Logs false, at least one test failed.
```

</details>

---

### `map`

*Higher-Order Function*
```JavaScript
map( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](#dfs) iterator. Constructs a structural copy of `subject` using the return values of `callback`, which is executed once for each primitive element.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each primitive element. Any return value (including `undefined`) will overwrite any primitives in the copy.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`**

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`**

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`**

  The Object/Array being enumerated.

#### Examples
<details><summary>Example 1: Using `map` to increment all numbers:</summary>

```JavaScript
var subject = {
  two: [2,4,6,8,10,12],
  thirteen: [13,15,17,19,21]
};

// Will increment all numbers and save them to a copy
var copy = differentia.map(subject, function (currentValue, accessor, subject) {
  if (typeof currentValue === "number") {
    return currentValue + 1;
  } else {
    return currentValue;
  }
});

console.log(copy);
// Logs:
/*
{
  two: [3,5,7,9,11,13],
  thirteen: [14,16,18,20,22]
};
*/
```

</details>

---

### `filter`

*Higher-Order Function*
```JavaScript
filter( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [bfs](#bfs) iterator. Constructs a structural copy of `subject` using only values/paths which pass the test in `callback`, which is executed once for each primitive element.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each primitive element. If `callback` returns `true`, the current value and node path will be cloned.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`**

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`**

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`**

  The Object/Array being enumerated.

#### Examples
<details><summary>Example 1: Using `filter` to only clone Numbers:</summary>

```JavaScript
var subject = {
  peopleCount: 3,
  people: [
    {
      name: "Jon Snow",
      number: 5555555555
    },
    {
      name: "John Madden",
      number: 1231231234
    },
    {
      name: "Jimmy Neutron",
      number: 1112223333
    }
  ]
};

// Will clone all numbers and their paths into a new Object
var copy = differentia.filter(subject, function (currentValue, accessor, subject) {
  return typeof currentValue === "number";
});

console.log(copy);
// Logs:
/*
{
  "peopleCount": 3,
  "people": [
    {
      "number": 5555555555
    },
    {
      "number": 1231231234
    },
    {
      "number": 1112223333
    }
  ]
}
*/
```

</details>