# `findPath`

*Function*
```JavaScript
findPath( subject, findValue [, search = null ] );
```
Traverses and enumerates `subject`, searching for `findValue`. Returns an Array containing the first found path to `findValue`, or `null` if it was not found.

## Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`findValue`** Object/Array

  The value to find the path of.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
Example 1: Using `paths` to record the paths/branches in an Object:

```JavaScript
var subject = {
  string1: "Pretty",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var path = differentia.findPath(subject, "Little Trees");

console.log(path);
/* Logs:
[
  ["array1", "1"]
]
*/
```