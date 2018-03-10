# `diffClone`

*Function*
```JavaScript
diffClone( subject , compared [, search = null ] );
```
Returns a clone of `subject`, containing only the properties which differ from those contained within `compared`.

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

  The Object or Array to clone from.

- **`compared`** Object/Array

  The Object or Array to compare `subject` to.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
Example 1: Using `diffClone` to clone an object's differing properties:

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

Example 2: Using `diffClone` with the `search` parameter to clone an object's *specific* differing properties:

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