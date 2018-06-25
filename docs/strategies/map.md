# `map`

*Higher-Order Function*
```JavaScript
map( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](http://differentia.io/?p=dfs) iterator. Constructs a structural copy of `subject` using the return values of `callback`, which is executed once for each primitive element.

## Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each primitive element. Any return value (including `undefined`) will overwrite any primitives in the copy.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

### Callback Parameters
- **`currentValue`**

  The value of the element of enumeration. Equal to `subject[accessor]`.

- **`accessor`**

  The accessor being used to retrieve `currentValue` from the Object/Array being enumerated.

- **`subject`**

  The Object/Array being enumerated.

## Examples
Example 1: Using `map` to increment all numbers:

```JavaScript
var subject = {
  two: [2,4,6,8,10,12],
  thirteen: [13,15,17,19,21]
};

// Will increment all numbers and save them to a copy
var copy = differentia.map(subject, function (currentValue, accessor, subject) {
  if (typeof currentValue === "number") {
    return currentValue + 1;
  } else {
    return currentValue;
  }
});

console.log(copy);
// Logs:
/*
{
  two: [3,5,7,9,11,13],
  thirteen: [14,16,18,20,22]
};
*/
```