Differentia.js
===
An Object Algorithm Library for JavaScript.



---

# :page_facing_up: Supported Data Types
DataType|Clone|Diff
---|---|---
Function|:x:|:x:
Symbol|:x:|:x:
Blob|:x:|:x:
Object|:white_check_mark:|:white_check_mark:
Array|:white_check_mark:|:white_check_mark:
String|:white_check_mark:|:white_check_mark:
Number|:white_check_mark:|:white_check_mark:
Boolean|:white_check_mark:|:white_check_mark:
RegExp|:white_check_mark:|:white_check_mark:
---

# :closed_book: Documentation
Differentia.js provides a basic suite of Object/Array focused utilities. They are all "deep" algorithms, and fully traverse all child Objects/Arrays/properties unlss given a search index object with specifies otherwise.

- Deep Object Cloning
- Deep Object Diffing
- Deep Freezing/Sealing
- Differential Deep Object Cloning
- A small compliment of higher-order functions.

## Functions
- [Main Functions](#main-functions)
  - [iddfs](#iddfs)
  - [clone](#clone)
  - [diffClone](#diffclone)
  - [diff](#diff)
  - [deepFreeze](#deepFreeze)
  - [deepSeal](#deepSeal)
- [Higher-Order Functions](#higher-order-functions)
  - [forEach](#forEach)
  - [find](#find)
  - [some](#some)
  - [every](#every)

---

# Main Functions

### `iddfs`

*Iterator Function*
```JavaScript
iddfs( subject [, search = null ] );
```
An implementation of [Iterative Deepening Depth-First Search](https://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search). Enumerates properties/elements in `subject`, traversing into any Objects/Arrays, using `search` as a search index. Any properties/nodes present in `search` will be used to enumerate, traverse, and access the properties/nodes of `subject`. If a property/node exists in `search` that does not exist in `subject`, or vice versa, it will be skipped.

Upon calling `next()`, the `iddfs` iterator exposes a single `value` object which encapsulates the state of iteration/traversal at the time of being returned. The object is a flyweight and is thus mutated between every iteration/traversal; because of this, do not attempt to store or otherwise rely on values contained within it.

The `value` object contains the following properties:

Property|Datatype|Description
---|---|---
accessor|Mixed|The accessor being used to access `value.tuple.subject` during property/element enumerations.
currentValue|Mixed|The value of the element of enumeration. Equal to `value.tuple.subject[value.accessor]`.
existing|`null` or Object|If `iddfs` encounters an Object/Array it has been before during the same search, this property will be set to the equivalent tuple; otherwise it will be `null`. Objects added to that tuple previously will show up again here.
isArray|Boolean|Indicates if the Object being traversed/enumerated is an Array.
isContainer|Boolean|Indicates if the current item of the enumeration is an Object or Array.
isFirst|Boolean|Indicates if the current item of the enumeration is the first item to be enumerated.
isLast|Boolean|Indicates if the current item of the enumeration is the last item to be enumerated.
iterations|Number|A number indicating how many items have been enumerated in the current Object/Array. Gets reset to `0` on each traversal.
length|Number|The total number of enumerable properties/elements of the current Object/Array being enumerated.
noIndex|Boolean|Indicates if a search index was not given. If `true`, then `search` is equal/assigned to `subject`.
traverse|Boolean|Indicates if the current item of enumeration should be traversed.
tuple|Object|An Object containing all Objects being traversed in parallel.

The `tuple` object contains the following properties:

Property|Datatype|Description
---|---|---
subject|Object/Array|The source of paths/elements for traversal/enumeration.
search|Object/Array|The source of target paths/elements for traversal/enumeration.

Traversal is performed upon this tuple of objects equally, providing they have overlapping/equal paths. If any node exists in `search` that does not exist in any one object of the tuple, then traversal is aborted for that specific object and it is dropped from the tuple; except if the object lacking the node is `subject`, in which case traversal is aborted completely across all objects of the tuple, and nothing is dropped from the tuple.

#### Parameters
- **`subject`**

  The root Object or Array to enumerate & traverse.

- **`search`**

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `iddfs` to traverse and enumerate an Object:</summary>

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

var search = differentia.iddfs(subject, subject);

// Starts on the top layer of the root of subject:
var iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings1"
console.log(iteration.value.currentValue); // Logs ["Hello World!"]
iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings2"
console.log(iteration.value.currentValue); // Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw:
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Good Morning!"
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Hello World!"
```

</details>

<details><summary>Example 2: Using `iddfs` with a search index to traverse and enumerate an Object's *specific* properties:</summary>

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

var search = differentia.iddfs(subject, search);

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

### `clone`

*Function*
```JavaScript
clone( subject [, search = null ] );
```
Returns a clone of `subject`. If `search` is provided, the clone will only contain properties/paths that are present in `search`.

#### Parameters
- **`subject`**

  The Object or Array to clone from.

- **`search`** (*Optional*)

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

#### Parameters

- **`subject`**

  The Object or Array to clone from.

- **`compared`**

  The Object or Array to compare `subject` to.

- **`search`** (*Optional*)

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
Returns `true` if any of `compared`'s properties differ in any way from `subject`, or `false` if otherwsie.

#### Parameters
- **`subject`**

  The Object or Array to compare `compared` to.

- **`compared`**

  The Object or Array to compare to `subject`.

- **`search`** (*Optional*)

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
- **`subject`**

  The Object or Array to freeze.

- **`search`** (*Optional*)

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
- **`subject`**

  The Object or Array to seal.

- **`search`** (*Optional*)

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `deepSeal` to seal all Objects/Arrays:</summary>

```JavaScript
//
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

# Higher-Order Functions

### `forEach`

*Higher-Order Function*
```JavaScript
forEach( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [iddfs](#iddfs) iterator. `callback` is executed for each element. Unlike `Array.prototype.forEach`, this implementation allows a return value of any type, which will be returned to the caller.

#### Parameters
- **`subject`**

  The root Object or Array to enumerate & traverse.

- **`callback`**

  The callback function to execute for each element.

- **`search`**

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`**

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`**

  The accessor being used to retrieve `value` from the Object/Array being enumerated.

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
A simple IOC wrapper to the [iddfs](#iddfs) iterator. `callback` is executed for each element. If `callback` returns `true` at any time, then `currentValue` is immediately returned. If `callback` never returns `true`, then `undefined` is returned.

#### Parameters
- **`subject`**

  The root Object or Array to enumerate & traverse.

- **`callback`**

  The callback function to execute for each element.

- **`search`**

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`**

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`**

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`**

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
A simple IOC wrapper to the [iddfs](#iddfs) iterator. `callback` is executed for each element. If `callback` returns `true` at any time, then `true` is immediately returned. If `callback` never returns `true`, then `false` is returned. You can use this function to test if a least one element of the Object tree passes a test.

#### Parameters
- **`subject`**

  The root Object or Array to enumerate & traverse.

- **`callback`**

  The callback function to execute for each element.

- **`search`**

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`**

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`**

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`**

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
A simple IOC wrapper to the [iddfs](#iddfs) iterator. `callback` is executed for each element. If `callback` returns `false` (or a non-truthy value) at any time, then `false` is immediately returned. If `callback` returns `true` for every element, then `true` is returned. You can use this function to test if all elements of the Object tree pass a test.

#### Parameters
- **`subject`**

  The root Object or Array to enumerate & traverse.

- **`callback`**

  The callback function to execute for each element.

- **`search`**

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Callback Parameters
- **`currentValue`**

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`**

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`**

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