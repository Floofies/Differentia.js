# `forEach`

*Higher-Order Function*
```JavaScript
forEach( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [dfs](#dfs) iterator. `callback` is executed for each element. Unlike `Array.prototype.forEach`, this implementation allows a return value of any type, which will be returned to the caller.

## Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each element.

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
<details><summary>Example 1: Using `forEach` to traverse and enumerate an Object:</summary>

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

differentia.forEach(subject, function (currentValue, accessor, subject) {
  console.log(accessor);
  console.log(currentValue);
});

// Starts on the top layer of the root of subject:
// Logs "greetings1"
// Logs ["Hello World!"]
// Logs "greetings2"
// Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw:
// Logs 0
// Logs "Good Morning!"
// Logs 0
// Logs "Hello World!"
```

</details>