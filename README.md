Differentia.js
===
Differentia.js is a tiny (2.7kB Minified) object diffing & cloning library for JavaScript.
>:warning: This project is in early Alpha, and is **not stable.** Infinite loops may occur. Use at your own risk.

>The cloning and diffing functions do not support Functions or Symbols, which are ignored.

---
#:package: Install

Clone this repository, and include `differentia.js` in your HTML `<head></head>` like so:

    <script type="text/javascript" src="path/to/differentia.js"></script>

Differentia can be accessed via the `differentia` object.

---
#:closed_book: Documentation
Differentia.js provides a basic suite of focused utilities.

- Deep Object Cloning
- Differential Deep Object Cloning
- Object Difference Checking
- A very small compliment of miscellaneous functions.

## Available Methods
- [Main](#main)
  - [clone](#clone)
  - [diffClone](#diffclone)
  - [isDiff](#isdiff)

- [Utility](#utility)
  - [forEach](#foreach)
  - [isInArray](#isinarray)
  - [getLength](#getlength)
  - [isPrimitive](#isprimitive)
  - [isContainer](#iscontainer)
  - [isObject](#isobject)
  - [isFunction](#isfunction)
  - [newContainer](#newcontainer)
  - [clonePrimitive](#cloneprimitive)

---
# Main

##`clone`
######Function
```JavaScript
clone( object );
```
Returns a clone of `object`.

#### Parameters
- **`object`**

  The Object or Array to clone from.

#### Examples
<details><summary>**Example 1:** Using `clone` to clone an object:</summary>
```JavaScript
var objectToClone = {
 string1: "Hello",
 string2: "World!"
}

var clonedObject = differentia.clone(objectToClone);
```
</details>

---
##`diffClone`
######Function
```JavaScript
diffClone( object1 , object2 , search );
```
Returns a clone of `object2`, containing only the properties which differ from `object1`.

#### Parameters

- **`object1`**

  The Object or Array to compare `object2` to.

- **`object2`**

  The Object or Array to clone from.

- **`search`** *Optional*

  An Object or Array specifying the properties to traverse and diff/clone. All other properties are ignored.

#### Examples
<details><summary>**Example 1:** Using `diffClone` to clone an object's differing properties:</summary>
```JavaScript
// The Object to compare `objectToClone` to:
var objectToCompareTo = {
 string1: "Hello",
 string2: "World!"
}

// The Object to clone from:
var objectToClone = {
 string1: "Hello",
 string2: "Bob",
 string3: "Ross!"
}

 var clonedObject = differentia.diffClone(objectToCompareTo, objectToClone);

 /*
 Variable `clonedObject` is now this Object:
 {
  string2: "Bob",
  string3: "Ross!"
 }
 */
 ```
</details>

<details><summary>**Example 2:** Using `diffClone` with the `search` parameter to clone an object's *specific* differing properties:</summary>
```JavaScript
var objectToCompareTo = {
 string1: "Hello",
 string2: "World!"
}

var objectToClone = {
 string1: "Burn the",
 string2: "Pretty",
 string3: "Little",
 string4: "Trees"
}

// Here, we ignore `string1`.
var searchParameters = {
 string2: "",
 string3: "",
 string4: ""
}

var clonedObject = differentia.diffClone(objectToCompareTo, objectToClone, searchParameters);

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
##`isDiff`
######Function
```JavaScript
isDiff( object1 , object2 );
```
Returns `true` if `object2`'s properties differ in any way from `object1`, or `false` if otherwsie.

#### Parameters
- **`object1`**

  The Object or Array to compare `object2` against.

- **`object2`**

  The Object or Array to compare to `object1`.

- **`search`** *Optional*

  An Object or Array specifying the properties to traverse and diff. All other properties are ignored.

#### Examples
<details><summary>**Example 1:** Using `isDiff` to see if an Object's enumerable properties differ from another:</summary>
```JavaScript
//
var object1 = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
}

var object2 = {
  string2: "Pretty",
  array1: [
    "Little Branches",
    "Little Leaves"
  ]
}
var doTheyDiffer = differentia.isDiff(object1, object2);
/*
`doTheyDiffer` is now `true`.
*/
```
</details>

<details><summary>**Example 2:** Using `isDiff` with the `search` parameter to diff an object's *specific* differing properties:</summary>
```JavaScript
var object1 = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
}

var object2 = {
  string2: "Pretty",
  array1: [
    "Little Clouds",
    "Autumn Day"
  ]
}

// Here, we ignore index `1` of `array1`.
var searchParameters = {
  string1: "",
  array1: [
    0: ""
  ]
}

var doTheyDiffer = differentia.isDiff(object1, searchParameters);
/*
`doTheyDiffer` is now `false`.
*/
```
</details>


---
# Utility

##`forEach`
######Function
```JavaScript
forEach( object , callback );
```
Executes `callback` for each `index` or `property` of `object`.
If `callback` invokes `return`, `forEach` and all prior recursive invocations of `forEach` will stop. Because of this, `return` is a good way to emulate `break`, as `break` is not available to `callback`.

Any data specified for `return` will be returned to the calling invocation.

#### Parameters
- **`object`**

  The Object or Array to enumerate.

- **`callback`**

  The Callback Function to execute.

  - **`index`** *Callback Argument*

    The current `index` or `property` of the Object being enumerated.

  - **`enumeration`** *Callback Argument*

    The reference to the currently enumerated `index` or `property` of the Object being enumerated.

#### Examples
<details><summary>**Example 1:** Using `forEach` to `console.log` a list of properties and Numbers:</summary>
```JavaScript
// The list of enumerated Numbers:
var numberList = "";
// The list of enumerated Properties:
var propertyList = "";

// The Object to enumerate:
var object1 = {
  "This is the first property, ": 123,
  "this is the second property, ": 456,
  "and this is the third property!": 789
}

// Our `forEach` adds `property` to `propertyList` on each iteration:
differentia.forEach(object1, function (property, enumeration) {
  numberList = numberList + String(enumeration);
  propertyList = propertyList + property;
});

// Now we log the results:
console.log(numberList);
console.log(propertyList);
/*
`console.log`'s: "123456789"
  and
`console.log`'s: This is the first property, this is the second property, and this is the third property!"
*/
```
</details>

<details><summary>**Example 2:** Using `forEach` to `return` a specific property:</summary>
```JavaScript
// The Object to enumerate:
var object1 = {
  "This is the first property, ": 123,
  "this is the second property, ": 456,
  "and this is the third property!": 789
}

// Our `forEach` adds `property` to `propertyList` on each iteration:
var result = differentia.forEach(object1, function (property) {
  if (object1[property] === 456) {
    return property;
  }
});

// Now we log the result:
console.log(result);
/*
`console.log`'s: "this is the second property,"
*/
```
</details>

---
##`isInArray`
######Function
```JavaScript
isInArray( value , array ,  start );
```
Returns `true` if `value` is found in `array`, or `false` if otherwise.

#### Parameters
- **`value`**

  The Value to look for.

- **`array`**

  The Array to search for `value` in.

- **`start`** *Optional*

  The `index` to begin the search at. *(Default: 0)*

#### Examples
<details><summary>**Example 1:** Using `isInArray` to find a specific String value:</summary>
```JavaScript
// The Array to search:
var array1 = {
  "Not Bob Ross",
  "Also not Bob Ross",
  "Bob Ross"
}

var found = differentia.isInArray("Bob Ross", array1);
/*
`found` is now `true`.
*/
```
</details>

---
##`getLength`
######Function
```JavaScript
getLength( object );
```
If `object` is an Object or Array, returns a Number reflecting the number of Properties or Indexes in `object`.
If `object` is a Primitive, returns a Number reflecting the number of characters in `object`.

#### Parameters
- **`object`**

  An Object, Array, or Primitive to count.

#### Examples
<details><summary>**Example 1:** Using `getLength` to count various Data Types:</summary>
```JavaScript
// Returns `5`:
differentia.getLength("Hello");

// Returns `10`:
differentia.getLength(5555555555);

// An Array to count:
var array1 = ["Bob Ross", "Rocks"];
// Returns `2`:
differentia.getLength(array1);

// An Object to count:
var object1 = {
  "No Mistakes": "Just Happy Accidents",
  "Let's Build Some": "Happy Little Trees"
};
// Returns `2`:
differentia.getLength(object1);
```
</details>

---
##`isPrimitive`
######Function
```JavaScript
isPrimitive( object );
```
Returns `true` if `object` is a Primitive, or `false` if otherwise.

#### Parameters
- **`object`**

  The item to examine.

---
##`isContainer`
######Function
```JavaScript
isContainer( object );
```
Returns `true` if `object` is an Object or Array, or `false` if otherwise.

#### Parameters
- **`object`**

  The item to examine.

---
##`isObject`
######Function
```JavaScript
isObject( object );
```
Returns `true` if `object` is an Object, or `false` if otherwise.

#### Parameters
- **`object`**

  The item to examine.

---
##`isFunction`
######Function
```JavaScript
isObject( object );
```
Returns `true` if `object` is a Function, or `false` if otherwise.

#### Parameters
- **`object`**

  The item to examine.

---
##`clonePrimitive`
######Function
```JavaScript
clonePrimitive( object );
```
Returns a clone of `object`.

#### Parameters
- **`object`**

  The Primitive to clone from.

---
##`newContainer`
######Function
```JavaScript
newContainer( object );
```
Returns a new empty Object if `object` is an Object, or a new empty Array if `object` is an Array.

#### Parameters
- **`object`**

  The Object or Array which dictates what Data Type the new Object should be.
