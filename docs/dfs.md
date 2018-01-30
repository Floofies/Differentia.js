### `dfs`

*Generator*
```JavaScript
dfs( subject, search = null ] );
```
An implementation of Depth-First Search. Enumerates properties/elements in `subject`, traversing into any Objects/Arrays, using `search` as a search index. Any properties/nodes present in `search` will be used to enumerate, traverse, and access the properties/nodes of `subject`. If a property/node exists in `search` that does not exist in `subject`, or vice versa, it will be skipped.

Upon calling `next()`, the `dfs` iterator exposes a single `value` object which encapsulates the state of iteration/traversal at the time of being returned. The object is a flyweight and is thus mutated between every iteration/traversal; because of this, do not attempt to store or otherwise rely on values contained within it.

#### Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`search`** (*Optional*) Object/Array

  An Object or Array specifying the properties to traverse and enumerate. All other properties are ignored.

#### Examples

##### Example 1: Using `dfs` to traverse and enumerate an Object:

```JavaScript
var subject = {
  greetings1: [
    "Hello World!"
  ],
  greetings2: [
    "Good Morning!"
  ]
};

var search = differentia.dfs(subject, subject);

// Starts on the top layer of the root of subject:
var iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings1"
console.log(iteration.value.currentValue); // Logs ["Hello World!"]
iteration = search.next();
console.log(iteration.value.accessor); // Logs "greetings2"
console.log(iteration.value.currentValue); // Logs ["Good Morning!"]

// Finished enumerating root Object...
// Now it will traverse and enumerate Objects/Arrays it saw in reverse order:
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Good Morning!"
iteration = search.next();
console.log(iteration.value.accessor); // Logs 0
console.log(iteration.value.currentValue); // Logs "Hello World!"
```

---

##### Example 2: Using `dfs` with a search index to traverse and enumerate an Object's *specific* properties:

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

var search = differentia.dfs(subject, search);

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
