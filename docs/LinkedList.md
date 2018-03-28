# `LinkedList`

*Class*
```JavaScript
new LinkedList( [ iterable = null ] );
```
> Uses [ListElement](http://differentia.io/?p=ListElement) to represent the list structure.

Acyclic Singly Linked List.

## Constructor Parameters
- **`iterable`** (*Optional*) Iterable

  The values of the optional Iterable will be used to populate the new LinkedList.

## Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Append "6" to the end of the list, returns a new ListElement.
var six = list.push(6);

// Prepends "7" to the beginning of the list, returns a new ListElement.
var seven = list.unshift(7);

// Moves "7" to the end of the list.
list.pushBack(seven);

// Logs 1, 2, 3, 4, 5, 6, and 7.
for (const element of list) {
	console.log(element.payload);
}
```

## Instance Properties

### `head`

*ListElement*
```JavaScript
LinkedList.head
```
A ListElement which is considered the head/start of the list, and is used to begin enumeration of subsequent ListElements.

---

### `tail`

*ListElement*
```JavaScript
LinkedList.tail
```
A ListElement which is considered the tail/end of the list, and is used to end enumeration of preceding ListElements.

---

### `size`

*Number*
```JavaScript
LinkedList.size
```
A number representing the quantity of ListElements within the LinkedList, not counting the head and tail elements.

---

## Member Methods

### `values`

*Iterator*
```JavaScript
LinkedList.values();
```
An iterator which yields the value of each ListElement in the LinkedList.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Logs 1, 2, 3, 4, and 5.
for (const value of list.values()) console.log(value);
```

---

### `elements`

*Iterator*
```JavaScript
LinkedList.elements();
```
An iterator which yields each ListElement in the LinkedList, except for the head and tail elements.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Logs 1, 2, 3, 4, and 5.
for (const value of list.values()) console.log(value);
```

---

# `forEach`

*Higher-Order Function*
```JavaScript
LinkedList.forEach( callback );
```
Calls `callback` with the value of each ListElement.

## Parameters
- **`callback`** Function

  The callback function to execute for each ListElement value.

### Callback Parameters
- **`value`**

  The value of the current ListElement being enumerated over.

- **`index`**

  The index (Starting at zero) of the current ListElement being enumerated over.

- **`list`**

  The target LinkedList being iterated through.

## Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Logs 1, 2, 3, 4, and 5.
list.forEach(function (value, index, list) {
  console.log(value);
});
```

---

### `fromIterable`

*Function*
```JavaScript
LinkedList.fromIterable( iterable );
```
Inserts the values of the Iterable into the LinkedList.

#### Parameters
- **`iterable`** Iterable

  The iterable to copy values from.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New empty LinkedList is created.
var list = new differentia.LinkedList();

// Contents of `arr` are inserted into the list.
list.fromIterable(arr);
```

---

### `coerceElement`

*Function*
```JavaScript
LinkedLst.coerceElement( value );
```
Creates a new ListElement using `value`. If `value` is already a ListElement, it is returned.

#### Parameters
- **`value`** Any

  A ListElement, or a value to create a new ListElement with.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Arbitrary number.
var numbers = 123;

// Returns a new ListElement with `numbers` assigned to `element.payload`.
var element = differentia.LinkedList.coerceElement(numbers);
```

---

### `item`

*Function*
```JavaScript
LinkedList.item( index );
```
Returns the ListElement at the specified 0-indexed offset from the head element, or `null` if it was not found.

#### Parameters
- **`index`** Number

  An offset from the head element, starting at zero, to look for a ListElement at.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Returns the ListElement at index 4, the last element in the list, which contains "5".
var foundElement = list.item(4);
```

---

### `find`

*Function*
```JavaScript
LinkedList.find( value );
```
Returns the first ListElement encountered that contains a payload matching `value`, or `null` if one was not found.

#### Parameters
- **`value`** Any

  A value to search for in the LinkedList.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Returns the ListElement containing "3".
var foundElement = list.find(3);
```

---

### `clear`

*Function*
```JavaScript
LinkedList.clear();
```
Removes all elements from the LinkedList.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// List becomes empty.
list.clear();
```

---

### `concat`

*Function*
```JavaScript
LinkedList.concat( list1 [, list2, ..., listN ] );
```
Concatenates multiple LinkedLists into the callee LinkedList.

#### Parameters
- **`list1`...`listN`** ListElement

  An argument list of LinkedLists to concatenate.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedLists are created using the contents of `arr`.
var list1 = new differentia.LinkedList(arr);
var list2 = new differentia.LinkedList(arr);
var list3 = new differentia.LinkedList(arr);

// Appends `list2` and `list3` to the end of `list1`.
list1.concat(list2, list3);

// Logs 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5.
for (const element of list) {
	console.log(element.payload);
}
```

---

### `remove`

*Function*
```JavaScript
LinkedList.remove( element );
```
Removes and returns an element from the LinkedList.

#### Parameters
- **`element`** ListElement

  A ListElement object to remove from the LinkedList.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Get the element which contains "3".
var three = list.get(3);

// Removes the element from the list.
list.remove(three);
```

---

### `insertBefore`

*Function*
```JavaScript
LinkedList.insertBefore( element, newElement );
```
Inserts a ListElement before `element`

#### Parameters
- **`element`** ListElement

  A ListElement object to prepend with newElement.

- **`element`** Any

  A ListElement or arbitrary value to add to the LinkedList before `element`.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Get the element which contains "3".
var three = list.get(3);

// Inserts "2.5" before "3".
var twoPointFive = list.insertBefore(three, 2.5);
```

---

### `insertAfter`

*Function*
```JavaScript
LinkedList.insertAfter( element, newElement );
```
Inserts a ListElement after `element`

#### Parameters
- **`element`** ListElement

  A ListElement object to prepend with newElement.

- **`element`** Any

  A ListElement or arbitrary value to add to the LinkedList after `element`.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Get the element which contains "3".
var three = list.get(3);

// Inserts "3.5" after "3".
var threePointFive = list.insertAfter(three, 3.5);
```

---

### `prepend`

*Function*
```JavaScript
LinkedList.prepend( element );
```
> Alias: `unshift`

Inserts a ListElement at the beginning of the LinkedList.

#### Parameters
- **`element`** Any

  A ListElement object to prepend the LinkedList with.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Inserts "0" at the beginning of the list.
var zero = list.prepend(0);
```

---

### `unshift`

*Function*
```JavaScript
LinkedList.unshift( element );
```
An alias of `LinkedList.prepend`.

---

### `append`

*Function*
```JavaScript
LinkedList.append( element );
```
> Alias: `push`

Inserts a ListElement at the end of the LinkedList.

#### Parameters
- **`element`** Any

  A ListElement object to append the LinkedList with.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Inserts "6" at the end of the list.
var six = list.append(6);
```

---

### `push`

*Function*
```JavaScript
LinkedList.push( element );
```
An alias of `LinkedList.append`.

---

### `shift`

*Function*
```JavaScript
LinkedList.shift();
```
Removes an element from the beginning of the LinkedList and returns it.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Removes and returns the first element in the list.
var one = list.shift();
```

---

### `pushBack`

*Function*
```JavaScript
LinkedList.pushBack( element );
```
Moves a ListElement to the end of the LinkedList.

#### Parameters
- **`element`** Any

  A ListElement object to move to the end of the LinkedList.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New LinkedList is created using the contents of `arr`.
var list = new differentia.LinkedList(arr);

// Returns the element containing "2".
var two = list.get(2);

// Moves "2" to the end of the list.
list.pushBack(two);
```
