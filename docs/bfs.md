# `bfs`

*Generator*
```JavaScript
bfs( subject [, search = null ] );
```
An implementation of Breadth-First Search. Enumerates properties/elements in `subject`, traversing into any Objects/Arrays, using `search` as a search index. Any properties/nodes present in `search` will be used to enumerate, traverse, and access the properties/nodes of `subject`. If a property/node exists in `search` that does not exist in `subject`, or vice versa, it will be skipped.

## Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

## Examples

Example 1: Using `bfs` to traverse and enumerate an Object:

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

var search = differentia.bfs(subject, subject);

// Starts on the top layer of the root of subject:
var iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings1"
console.log(iteration.value.currentValue); // Logs ["Hello World!"]
iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings2"
console.log(iteration.value.currentValue); // Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw in-order:
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Hello World"
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Good Morning"
```

--- 

Example 2: Using `bfs` with a search index to traverse and enumerate an Object's *specific* properties:

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

var search = {
  greetings2: {
    0: null
  }
};

var search = differentia.bfs(subject, search);

// Starts on the top layer of the root of subject:
var iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings2"
console.log(iteration.value.currentValue); // Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw:
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Good Morning!"
```