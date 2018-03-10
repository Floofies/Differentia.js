# `find`

*Higher-Order Function*
```JavaScript
find( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](http://differentia.io/?p=dfs) iterator. `callback` is executed for each element. If `callback` returns `true` at any time, then `currentValue` is immediately returned. If `callback` never returns `true`, then `undefined` is returned.

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
Example 1: Using `find` to find a value in an Object:

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

// This will find a value.
var foundValue = differentia.find(subject, function (currentValue, accessor, subject) {
  return currentValue === "Good Morning!";
});
console.log(foundValue); // Logs "Good Morning!";

// This will not find a value.
foundValue = differentia.find(subject, function (currentValue, accessor, subject) {
  return currentValue === "This does not exist in the Array!";
});
console.log(foundValue); // Logs undefined;
```