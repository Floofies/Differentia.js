# `BinaryTree`

*Class*
```JavaScript
new BinaryTree( [ iterable = null ] );
```
> Uses [TreeElement](http://differentia.io/?p=TreeElement) to represent the tree structure.

Order-2 Binary Tree, stores nodes by integer weight.

## Constructor Parameters
- **`iterable`** (*Optional*) Iterable

  The values of the optional Iterable will be used to populate the new BinaryTree.

## Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New BinaryTree is created using the contents of `arr`.
var btree = new differentia.BinaryTree(arr);

// Inserts "3.5" into the tree, returns a new TreeElement.
var threePointFive = btree.add(3.5);

// Finds and returns the element with the highest weight.
var six = btree.getMax();

// Finds and returns the element with the lowest weight.
var one = btree.getMin();

// Logs 1, 2, 3, 3.5, 4, and 5.
for (const element of btree) {
	console.log(element.payload);
}
```

## Member Methods

### `values`

*Iterator*
```JavaScript
BinaryTree.values();
```
A Depth-First Search Iterator which returns a `TreeElement` for every call to `next()`.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New BinaryTree is created using the contents of `arr`.
var btree = new differentia.BinaryTree(arr);

// Instantiates the GeneratorFunction.
var iterator = btree.values();

// Logs 1, 2, 3, 4, and 5.
do {
	var state = iterator.next();
	console.log(state.value);
} while (!state.done);
```

---

### `fromIterable`

*Function*
```JavaScript
BinaryTree.fromIterable( iterable );
```
Inserts the values of the Iterable into the BinaryTree. Values which are integers will also be used as the weights for their TreeElements.

#### Parameters
- **`iterable`** Iterable

  The iterable to copy values from.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New empty BinaryTree is created.
var btree = new differentia.BinaryTree();

// Contents of `arr` are inserted into the tree.
btree.fromIterable(arr);
```

---

### `coerceElement`

*Function*
```JavaScript
BinaryTree.coerceElement( value );
```
Creates a new TreeElement using `value`. If `value` is already a TreeElement, it is returned.

#### Parameters
- **`value`** Any

  A TreeElement, or a value to create a new TreeElement with.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Arbitrary number.
var numbers = 123;

// Returns a new TreeElement with `numbers` assigned to `element.payload`.
var element = differentia.BinaryTree.coerceElement(numbers);
```

---

### `clear`

*Function*
```JavaScript
BinaryTree.clear();
```
Removes all elements from the BinaryTree.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New BinaryTree is created using the contents of `arr`.
var btree = new differentia.BinaryTree(arr);

// Tree becomes empty.
btree.clear();
```

---

### `dfs`

*Function*
```JavaScript
BinaryTree.bfs( [ startElement = null ] );
```
A Depth-First Search Iterator which returns a `TreeElement` for every call to `next()`.

#### Parameters
- **`startElement`** TreeElement

  A TreeElement to begin iteration at.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5];

// New BinaryTree is created using the contents of `arr`.
var btree = new differentia.BinaryTree(arr);

// Instantiates the GeneratorFunction.
var iterator = btree.bfs();

// Logs 1, 2, 3, 4, and 5.
do {
	var state = iterator.next();
	console.log(state.value);
} while (!state.done);
```

---

### `bfs`

*Function*
```JavaScript
BinaryTree.bfs( [ startElement = null ] );
```
A Breadth-First Search Iterator which returns a `TreeElement` for every call to `next()`.

#### Parameters
- **`startElement`** TreeElement

  A TreeElement to begin iteration at.

#### Examples
Example 1: Basic Usage:

```JavaScript
// Array of arbitrary numbers.
var arr = [1,2,3,4,5,6,7,8,9,0];

// New BinaryTree is created using the contents of `arr`.
var btree = new differentia.BinaryTree(arr);

// Instantiates the GeneratorFunction.
var iterator = btree.bfs();

// Logs 1, 2, 3, 4, and 5.
do {
	var state = iterator.next();
	console.log(state.value);
} while (!state.done);
```

---