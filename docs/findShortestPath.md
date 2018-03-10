# `findShortestPath`

*Function*
```JavaScript
findShortestPath( subject, findValue [, search = null ] );
```
Traverses and enumerates `subject`, searching for `findValue`. Returns an Array containing the shortest found path to `findValue`, or `null` if it was not found.

## Parameters
- **`subject`** Object/Array

  The Object or Array to search.

- **`findValue`** Object/Array

  The value to find the path of.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples
<details><summary>Example 1: Using `findShortestPath` to record the shortest path/branch to a value in an Object:</summary>

```JavaScript
var subject = {
  string1: "Pretty",
  string2: "Little Trees",
  array1: [
    "Little Clouds",
    "Little Trees"
  ]
};

var path = differentia.findShortestPath(subject, "Little Trees");

console.log(path);
/* Logs:
["string2"]
*/
```
</details>