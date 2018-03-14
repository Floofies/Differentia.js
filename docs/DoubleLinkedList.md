# `DoubleLinkedList`

*Class*
```JavaScript
new CircularDoubleLinkedList( [ iterable = null ] );
```
> Inherits from [LinkedList](http://differentia.io/?p=LinkedList)

> Uses [ListElement](http://differentia.io/?p=ListElement) to represent the list structure.

Circular Doubly Linked List. Elements have references to previous elements, making some operations faster.

## Constructor Parameters
- **`iterable`** (*Optional*) Iterable

  The values of the optional Iterable will be used to populate the new CircularDoubleLinkedList.

## Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.CircularDoubleLinkedList(arr);

// Append "6" to the end of the list, returns a new ListElement.
var six = list.push(6);

// Prepends "7" to the beginning of the list, returns a new ListElement.
var seven = list.unshift(7);

// Moves "7" to the end of the list.
list.pushBack(seven);

// Repeatedly logs 1, 2, 3, 4, 5, 6, and 7.
for (const element of list) {
	console.log(element.payload);
}
```

> Refer to the [LinkedList](http://differentia.io/?p=LinkedList) documentation for member methods & properties.