# `diff`

*Function*
```JavaScript
diff( subject , compared [, search = null ] );
```
Returns `true` if `compared`'s structure, properties, or values differ in any way from `subject`, or `false` if otherwsie.

## Supported Data Types
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

## Parameters
- **`subject`** Object/Array

  The Object or Array to compare `compared` to.

- **`compared`** Object/Array

  The Object or Array to compare to `subject`.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
Example 1: Using `diff` to see if an Object's enumerable properties differ from another:

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

---

Example 2: Using `diff` with the `search` parameter to diff an object's *specific* differing properties:

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