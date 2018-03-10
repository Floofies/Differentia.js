# `deepFreeze`

*Function*
```JavaScript
deepFreeze( subject [, search = null ] );
```
Traverses and enumerates `subject`, freezing it and it's children. Uses `Object.freeze()`. Returns the frozen Object/Array. The method directly mutates the Object/Array.

## Parameters
- **`subject`** Object/Array

  The Object or Array to freeze.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
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