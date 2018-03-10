# `filter`

*Higher-Order Function*
```JavaScript
filter( subject , callback [, search = null ] );
```
A simple IOC wrapper to the [bfs](http://differentia.io/?p=bfs) iterator. Constructs a structural copy of `subject` using only values/paths which pass the test in `callback`, which is executed once for each primitive element.

## Parameters
- **`subject`** Object/Array

  The root Object or Array to enumerate & traverse.

- **`callback`** Function

  The callback function to execute for each primitive element. If `callback` returns `true`, the current value and node path will be cloned.

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
Example 1: Using `filter` to only clone Numbers:

```JavaScript
var subject = {
  peopleCount: 3,
  people: [
    {
      name: "Jon Snow",
      number: 5555555555
    },
    {
      name: "John Madden",
      number: 1231231234
    },
    {
      name: "Jimmy Neutron",
      number: 1112223333
    }
  ]
};

// Will clone all numbers and their paths into a new Object
var copy = differentia.filter(subject, function (currentValue, accessor, subject) {
  return typeof currentValue === "number";
});

console.log(copy);
// Logs:
/*
{
  "peopleCount": 3,
  "people": [
    {
      "number": 5555555555
    },
    {
      "number": 1231231234
    },
    {
      "number": 1112223333
    }
  ]
}
*/
```