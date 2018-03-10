# `some`

*Higher-Order Function*
```JavaScript
some( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](http://differentia.io/?p=dfs) iterator. `callback` is executed for each element. If `callback` returns `true` at any time, then `true` is immediately returned. If `callback` never returns `true`, then `false` is returned. You can use this function to test if a least one element of the Object tree passes a test.

## Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each element.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

### Callback Parameters
- **`currentValue`** Mixed

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`** Mixed

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`** Object/Array

  The Object/Array being enumerated.

## Examples
Example 1: Using `some` to verify if at least one element in an Object passes a test:

```JavaScript
var subject = [100, 200, 300, 400, 500];

// This test will pass for at least one value, and will not run more than once.
var passed = differentia.some(subject, function (currentValue, accessor, subject) {
  return currentValue === 300;
});
console.log(passed); // Logs true, at least one test passed.

// This test will fail for all values.
passed = differentia.some(subject, function (currentValue, accessor, subject) {
  return currentValue === 9000;
});
console.log(passed); // Logs false, all tests failed.
```