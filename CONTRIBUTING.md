# :pencil2: Contributing
Contributing to the project is very easy. Additions to the library are handled via a standard Strategy Pattern.

# Testing & Building
### Pre-requisites
- `node`
- `make`

## Testing
> The makefile installs a local copy of `jasmine` to run tests.

**Node Tests**: `make test`

**Browser Tests**: Open `SpecRunner.html` in a web browser.

## Production Build
> The makefile installs a local copy of `uglify-es` for beautification/minification.

**Production Build**: `make prod` or `make prod clean`

Creates a `prod-build` directory to build the production release into. Saves `src/differentia.js` into `prod-build/src`, then comment-less and minified versions into `prod-build/lib`. Also includes `package.json`, `README.md`, and `spec` in the root directory.

Add `clean` at the end to remove `node_modules`.

# Adding Algorithms
To add an algorithm to the library, you must use the Strategy Pattern together with `runStrategy`, which is the primary gateway for your algorithms to interact with and use the `iddfs` iterator. Your algorithm will be tightly coupled to the  the `iddfs` iterator, and you should make use of one of the many properties made available through it's `state` object. An algorithm may "steer" the search algorithm by directly mutating certain properties of `state`. See documentation for `iddfs` in `README.md` for more information.

All strategies added to the `strategies` object will be automatically revealed to the end-user via their `interface` properties. Once you add a strategy, you should also include it's name in `spec/Spec.js` in the first unit test, as part of the `modules` array; the test will verify that your strategy is accessible.

You should also write a unit test for your algorithm at the bottom of the file, using `describe`, `it`, and `expect` in nested order. There is a generic `diff` function available specifically for unit tests, in case you need to check one object against another. (Do not use the `diff` function provided by `differentia`, or any other function in the module, to do this verification).

Here is a basic example of a `jasmine` unit test:

```JavaScript
describe("two plus two", function () {
	it("should equal four", function () {
		expect(2+2).toBe(4);
	});
});
```

---

### `runStrategy`

*Function*
```JavaScript
runStrategy( strategy, parameters );
```
An IOC wrapper to the `iddfs` iterator. (See documentation for `iddfs` in `README.md` for more information.). `runStrategy` advances the `iddfs` iterator and executes Call-With-Current-State callbacks supplied in `strategy`. The state flyweight object is passed to `strategy.main`, which is executed for each element, and `strategy.entry`, which is only executed for the first element. If `strategy.main` returns something other than `undefined`, it will be returned to the caller.

#### Parameters
- **`strategy`** Object

  The strategy Object. It consists of the following properties:

Property|Data Type|Description
---|---|---
`interface`|Function|The interface revealed by `module.exports` and the global `differentia` namespace.
`entry`|Function|(*Optional*) A Call-With-Current-State callback to run with the first iterator state, only once.
`main`|Function|A Call-With-Current-State callback to run on every element.

`interface` is exposed to and directly run by the end-user; the function must contain a call to `runStrategy`. `entry` and `main` recieve a single `state` argument, the iterator state flyweight Object, which is a single object the iterator actively mutates per-iteration. See documentation for `iddfs` in `README.md` for more information.

- **`parameters`** Object

  Avaiable to callbacks via `state.parameters`. It consists of the following properties, but may contain any number of custom properties:

Property|Data Type|Description
---|---|---
`subject`|Object/Array|The Object or Array to traverse/iterate.
`search`|Object/Array|(*Optional*) A search index specifying the paths to traverse, and property accessors to enumerate. All other properties are ignored.

---

## Example Algorithm

This example is an algorithm that overwrites every Primitive of an Object tree with "Hello World".

```JavaScript
// Our test Object
var subject = {
  greetings1: [
    "Good Afternoon"
  ],
  greetings2: [
    "Good Morning"
  ]
};

// Define your Strategy. "main" and "interface" properties are required.
strategies.myStrategy = {
	interface: function (object) {
		runStrategy(strategies.myStrategy, {
			subject: object
		});
	},
	main: function (state) {
		// Only overwrite Primitives
		if (!state.isContainer) {
			state.tuple.subject[state.accessor] = "Hello World";
		}
	}
};

// Runs the Strategy. This function is exposed to the end-user.
strategies.myStrategy.interface(subject);

// We can now see the Primitives were overwritten with "Hello World".
console.log(subject);
/*
"{
	greetings1: [
		"Hello World"
	],
	greetings2: [
		"Hello World"
	]
}"
*/
```