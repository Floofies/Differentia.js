# `every`

*Higher-Order Function*
```JavaScript
every( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](#dfs) iterator. `callback` is executed for each element. If `callback` returns `false` (or a non-truthy value) at any time, then `false` is immediately returned. If `callback` returns `true` for every element, then `true` is returned. You can use this function to test if all elements of the Object tree pass a test.

## Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each element.

- **`search`** (*Optional*)  Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

### Callback Parameters
- **`currentValue`** Mixed

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`** Mixed

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`** Object/Array

  The Object/Array being enumerated.

## Examples
Example 1: Using `every` to verify if all elements in an Object pass a test:

```JavaScript
var subject = [100, 200, 300, 400, 500];

// This test will pass for all values.
var passed = differentia.every(subject, function (currentValue, accessor, subject) {
  return currentValue >= 100;
});
console.log(passed); // Logs true, all tests passed.

// This test will fail for the first value, and will not run more than once.
passed = differentia.every(subject, function (currentValue, accessor, subject) {
  return currentValue === 9000;
});
console.log(passed); // Logs false, at least one test failed.
```