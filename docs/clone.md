# `clone`

*Function*
```JavaScript
clone( subject [, search = null ] );
```
Returns a clone of `subject`. If `search` is provided, the clone will only contain properties/paths that are present in `search`.

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

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
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