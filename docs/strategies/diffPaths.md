# `diffPaths`

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
Example 1: Using `paths` to find differing paths/branches:

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