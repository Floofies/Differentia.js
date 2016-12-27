Differentia.js
===
Differentia.js is a tiny (2.7kB Minified) object diffing & cloning library for JavaScript.
>:warning: This project is in early Alpha, and is **not stable.** Infinite loops may occur. Use at your own risk.

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
### `clone`
```JavaScript
clone( object );
```
Returns a clone of `object`.

#### Parameters
- **`object`**
 
  The Object or Array to clone from.
 
#### Examples
##### Example 1: **Using `clone` to clone an object:**
```JavaScript
var objectToClone = {
 string1: "Hello",
 string2: "World!"
}
 
var clonedObject = differentia.clone(objectToClone);
```
 
---
### `diffClone`
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
##### Example 1: **Using `diffClone` to clone an object's differing properties:**
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
 
##### Example 2: **Using `diffClone` with the `search` parameter to clone an object's *specific* differing properties:**
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
---

### `isDiff`
```JavaScript
isDiff( object1 , object2 );
```
Returns `true` if `object2`'s properties differ in any way from `object1`, or `false` if otherwsie.

#### Parameters
- **`object1`**
 
  The Object or Array to compare `object2` against.
  
- **`object2`**

  The Object or Array to compare to `object1`.
 
#### Examples
##### Example 1: **Using `isDiff` to see if an Object's enumerable properties differ from another:**
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

##### Example 2: **Using `isDiff` with the `search` parameter to diff an object's *specific* differing properties:**
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
---
WIP For Style Review
