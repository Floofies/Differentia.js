# `paths`

*Function*
```JavaScript
paths( subject [, search = null ] );
```
Traverses and enumerates `subject`, returning an array listing all paths of the tree, including primitive data types.

## Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
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