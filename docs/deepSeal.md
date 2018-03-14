# `deepSeal`

*Function*
```JavaScript
deepSeal( subject [, search = null ] );
```
Traverses and enumerates `subject`, sealing it and and it's children. Uses `Object.seal()`. Returns the sealed Object/Array. The method directly mutates the Object/Array.

## Parameters
- **`subject`** Object/Array

  The Object or Array to seal.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
Example 1: Using `deepSeal` to seal all Objects/Arrays:

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