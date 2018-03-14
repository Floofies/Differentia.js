### `ListElement`

*Function*
```JavaScript
new LinkedList.ListElement( [ payload = null ], [ next = null ], [ prev = null ] );
```
The class used internally by [LinkedList](http://differentia.io/?p=LinkedList) to represent an element of the Linked List.

#### Parameters
- **`payload`** (*Optional*) Any

  Arbitrary data which is assigned to `ListElement.payload`.

- **`next`** (*Optional*) ListElement

  A `ListElement` to refer to as being next the next element.

- **`prev`** (*Optional*) ListElement

  A `ListElement` to refer to as being the previous element.

#### Examples
Example 1: Basic Usage

```JavaScript
// An arbitrary number.
var number = 123;

// Creates a new empty LinkedList.
var list = new differentia.LinkedList();

// Creates a new ListElement with `ints` assigned to `element.payload`
var element = new list.ListElement(number);

// Appends `element` to the end of the list.
list.push(element);

// Removes `element` from the list.
list.remove(element);
```
## Member Methods
### `fromElement`

*Function*
```JavaScript
ListElement.fromElement( element );
```
Copies the payload of a ListElement into the callee ListElement.

#### Parameters
- **`element`** ListElement

  A ListElement to copy the payload from.

#### Examples
Example 1: Basic Usage:

```JavaScript
// A source ListElement
var element1 = new differentia.LinkedList.ListElement(123);

// A destination ListElement
var element2 =  new differentia.LinkedList.ListElement();

// Copies the payload of `element1` into `element2`.
element2.fromElement(element1);
```