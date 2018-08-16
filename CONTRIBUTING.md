# :postbox: Contributing
Contributing to the project is very easy.
- `searchIterator` strategies/algorithms are contained in the `strategies` object.
- Data structures are contained in the `structs` object.
- Unit testing is handled via Jasmine.
- Building is handled via NPM with Browserify, UglifyJS, and `build.sh` (Bash).

To contribute, simply fork the `master` repository and submit a pull request containing your changes. Your changes must be clearly outlined in the description. Keep in mind that the stability of the source code in the `master` repository may not always be favorable.

# :hammer: Building

The only pre-requisites are Bash, NodeJS, and NPM.

The NPM production build, which uses Browserify and UglifyJS, can be created by entering `npm run build` in Terminal.

Running `npm run build` creates a `prod-build` directory, copies `src` into `prod-build/src`, creates comment-less and minified versions in `prod-build/dist`, copies the Jasmine unit test Specs into `prod-build/spec`, and includes copies of `package.json` & `README.md`.

# :bug: Unit Testing

**Do not use any functions or classes provided by the `differentia` module to verify test results!**

Browser tests can be run by opening `SpecRunner.html` in a web browser, and uses the Browserify module located in `prod-build/dist/differentia.js`; ensure you have first run `npm run build` to create/update the module.

NodeJS tests can be run by running `npm test` or `jasmine` in Terminal, and uses the CommonJS module index located in `src/index,js`.

Unit tests are performed with Jasmine, using `describe`, `it`, and `expect` in nested order. Unit tests must be added either to an appropriate pre-existing Spec file, or a new Spec file. Typically, tests which operate similarly or on similar input data can be grouped, for example the `Queue` and `Stack` data structures are grouped with the `LinkedList` tests because `Queue` and `Stack` utilize `LinkedList` to implement their functionality.

Before tests execute, a module named `globalLoader.js` injects the Differentia library into the Jasmine `global` object, adding `differentia` and its shorthand `d` as properties. Additionally, several testing utilities are injected into the `global` object by a module named `testUtils.js`; the module also tests itself before doing so. The following utilities may be found in the `global` object:

## `global` Object Properties

- `differentia` : The Differentia library, loaded using `src/index.js`.
- `d` : Shorthand for `differentia`.
- `createTestObject` : Creates a complex object used for testing `searchIterator` and its strategues.
- `testObjects` : Creates objects used for testing `searchIterator` and its strategies, sometimes utilizing `createTestObject`.
	
	One of several methods may be used to create test objects:

	- Multipath
	- Linear Acylic
	- Nested Acylic
	- Multidimensional Acyclic
	- Linear Cyclic
	- Nested Cyclic
	- Multidimensional Cyclic

- `createKeyCounter` : Creates a special tracking object for `createTestObject` to store `searchIterator` node visit counts.
- `testLength` : Returns a Number indicating how many enumerable properties are in an Object, or how many elements are in an Array.
- `testDiff` : Compares two Object trees and returns `true` if the Objects are differet, or `false` if they are the same.
- `supportedRegExpProps` : Lists 3 property Booleans to indicate whether specific "new" `RegExp` Object properties are supported.

	- `sticky` : Set to `true` if the `sticky` property is supported.
	- `unicode` : Set to `true` if the `unicode` property is supported.
	- `flags` : Set to `true` if the `flags` property is supported.

## Examples

Here is a basic example of a `jasmine` unit test:

```JavaScript
describe("two plus two", function () {
	it("should equal four", function () {
		expect(2+2).toEqual(4);
	});
});
```

Here is a real example taken from `spec/Spec.js`:

```JavaScript
describe("getContainerLength", function () {
	var array = [1, 2, 3, 4, 5];
	var object = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
	it("should count 5 items in each container", function () {
		expect(d.getContainerLength(array)).toBe(5);
		expect(d.getContainerLength(object)).toBe(5);
	});
});
```

# :herb: Adding Data Structures
To add a data structure to the library, you must add a class constructor usable with the `new` keyword. Your class must exist within it's own file in the `src/structs` directory, which should be named after the class itself.

The class is named `MyStruct`, and thus exists in a file such as this: `src/structs/MyStruct.js`.

# :mag: Adding Search Algorithm Strategies

To add an search algorithm to the library, you must use the Strategy Pattern together with `runStrategy`, which is the primary gateway for your algorithms to interact with a search iterator. Your algorithm will be tightly coupled to `searchIterator`, and you should make use of one of the many properties made available through it's shared state object. An algorithm may "steer" the search algorithm by directly mutating certain properties of `state`.

All strategies added to the `strategies` object will be automatically revealed to the end-user via their `interface` properties. 

## Creating a Search Algorithm Strategy Object
A Strategy is an object with the following properties:

Property|Data Type|Description
---|---|---
`interface`|Function|The interface function revealed by `module.exports` and the global `differentia` namespace, to be exposed to and directly run by the end-user. The function must contain a call to `runStrategy`, supplying it's parent object as the first parameter.
`entry`|Function|(*Optional*) A Call-With-Current-State callback to run once on the first iteration. This function cannot return anything. Initial set-up code should be run in this function.
`main`|Function|A Call-With-Current-State callback to run on every iteraton. If this function returns something other than `undefined`, it will be returned to the user's caller.
`done`|Function|(*Optional*) A Call-With-Current-State callback to run on the last iteration. It recieves the return value of `main` as its second argument. If this function returns something other than `undefined`, it will be returned to the user's caller; otherwise, the value returned by `main` will be returned to the user's caller.
`error`|Function|(*Optional*) A Call-With-Current-State callback to run when an error thrown. It recieves the `Error` object as its second argument. If this function returns something other than `undefined`, it will be returned to the user's caller.

`entry`, `main`, `done`, and `error` all recieve a `state` object as their first parameter, which is the iterator's state flyweight object; a single object which the iterator actively mutates per-iteration.

---

Your Strategy's `interface` function must call `runStrategy` if it needs to use the search iterators:

### `runStrategy`

*Function*
```JavaScript
runStrategy( strategy, searchAlg, parameters );
```
An IOC wrapper for the Search Iterators. `runStrategy` advances the iterator returned by `searchAlg` and executes Call-With-Current-State functions supplied in `strategy`.

- The state flyweight object is passed to `strategy.entry`, which is only executed for the first element, and `strategy.main` which is executed for every element.
- If `strategy.main` returns something other than `undefined`, it will be returned to the caller after passing through `strategy.done`.
- If the iterator has reached the last element then `strategy.done` will be executed, optionally with the return value of `strategy.main` as it's second argument.
- If the source code of `searchIterator` or the strategy throws an error, the `strategy.error` method will be invoked with the error object. Otherwise, the error is re-thrown by `runStrategy`.
- `searchAlg` is the search algorithm iterator to use; it can be `dfs` or `bfs`, or any other Iterator.

#### Parameters
- **`strategy`** Object

  The strategy Object.

- **`searchAlg`** Iterator

  An iterator to use as the search algorthm; it can be `dfs` or `bfs`, or any Generator.

- **`parameters`** Object

  Avaiable to callbacks via `state.parameters`. It consists of the following properties, but may contain any number of custom properties:

Property|Data Type|Description
---|---|---
`subject`|Object/Array|The Object or Array to traverse/iterate.
`search`|Object/Array|(*Optional*) A search index specifying the paths to traverse, and property accessors to enumerate. All other properties are ignored.

---

## Example Strategy

This example is an algorithm that returns an object if it contains the string "Good Morning".

```JavaScript
// Our test Object we will search for "Good Morning".
var subject = {
  greetings1: [
    "Good Afternoon"
  ],
  greetings2: [
    "Good Morning"
  ]
};

// Define your Strategy, adding it to the "strategies" object. "main" and "interface" properties are required.
strategies.myStrategy = {
	interface: function (object) {
		// This function will be run directly by the library user.
		// Here we call `runStrategy` and include our Strategy as parameter 1.
		// `runStrategy` will then begin to execute below callbacks.
		runStrategy(strategies.myStrategy, dfs {
			subject: object
		});
	},
	entry: function (state) {
		// This function will be executed only on the first iteration.
		// Here we run our initial set-up steps.
		state.returnValue = null;
	},
	main: function (state) {
		// This function will be executed for every iteration.
		// Here, we compare the element being iterated over to our desired string.
		if (state.tuple.subject[state.accessor] === "Good Morning") {
			// We found the string, so we'll return the parent object.
			return state.tuple.subject;
		}
		// Throw an error if we never found the string.
		if (state.isLast) {
			throw new Error("String missing");
		}
	},
	done: function (state, returnValue) {
		// This function will be executed for the last iteration, or after `main` returns something.
		// We have the return value of `main` as our second argument.
		// Here we will add more strings to the object before returning it.
		returnValue.push("Good Night");
		return returnValue;
	},
	error: function (error, returnValue) {
		// This function will be executed if any of the above callbacks throws an error.
		if (error.message === "String missing") {
			// Handle the error
			console.error(error.message);
			// Logs: "String missing"
		} else {
			// Can't handle the error; so re-throw.
			throw error;
		}
	}
};

// Runs the Strategy. This function is exposed to the end-user.
var greetings = strategies.myStrategy.interface(subject);

// We can now see the string we were searching for and the string we added:
console.log(greetings);
/* Logs:
"[
	"Good Morning",
	"Good Night"
]"
*/
```
# :blue_book: Adding Documentation

To add documentation to the library, two areas require your attention: Markdown files in the `/docs` directory, and the [documentation website](http://www.differentia.io) which serves to display it. Additions to documentation are not required for pull requests to be accepted. New or changed documentation must match the following format:

## Documentation Template

``````
# `Entry Name`

*Entry Type*
```JavaScript
// Basic Usage Example
```
Describe your entry here, including the return value (if any).

## Parameters
- **`arg`** Type

  Describe the above parameter here.

## Examples
<details><summary>Example 1: Describe your example here:</summary>

```JavaScript
// Include all code needed to run the example.
//
```
</details>

---
``````

## Example Documentation

``````
# `myFunction`

*Function*
```JavaScript
myFunction( arg [, optionalArg = null ] );
```
`myFunction` does Foo, and returns Bar.

## Parameters
- **`arg`** Number

  This argument is for X purpose.

- **`optionalArg`** (*Optional*) Number

  This argument is for Y purpose.

## Examples
Example 1: How to use myFunction:

```JavaScript
// Here are some numbers.
var arg = 123;
var optionalArg = 456;

// myFunction does X with the numbers.
differentia.myFunction(arg, optionalArg);
```

---
``````