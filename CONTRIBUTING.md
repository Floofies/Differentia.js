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
To add an algorithm to the library, you must use the Strategy Pattern together with `runStrategy`:

### `runStrategy`

*Function*
```JavaScript
runStrategy( strategy, parameters );
```
An IOC wrapper to the `iddfs` iterator. (See documentation for `iddfs` in `README.md` for more information.). `runStrategy` advances the `iddfs` iterator and executes Call-With-Current-State callbacks supplied in `strategy`. The state flyweight object is passed to `strategy.main`, which is executed for each element, and `strategy.entry`, which is only executed for the first element. If `strategy.main` returns something other than `undefined`, it will be returned to the caller.

#### Parameters
- **`strategy`** Object

  The strategy Object, containing properties `interface`, `main`, and optionally `entry`.

This Object consists of the following properties:
Property|Data Type|Description
---|---|---
`interface`|Function|The interface revealed by `module.exports` and the global `differentia` namespace.
`entry`|Function|(*Optional*) A Call-With-Current-State callback to run with the first iterator state, only once.
`main`|Function|A Call-With-Current-State callback to run on every element.

`entry` and `main` recieve a single `state` argument, the iterator state flyweight Object, which is a single object the iterator actively mutates per-iteration. See documentation for `iddfs` in `README.md` for more information.

- **`parameters`** Object

  Avaiable to callbacks via `state.parameters`. It consists of the following properties, but may contain any number of custom properties:

Property|Data Type|Description
---|---|---
`subjectRoot`|Object/Array|(*Optional*) The Object or Array to traverse/iterate.
`searchRoot`|Object/Array|A search index specifying the paths to traverse, and property accessors to enumerate. All other properties are ignored.

#### Examples
<details><summary>Example 1: Using `runStrategy` to write an algorithm that overwrites every Primitive of an Object tree with "Hello World":</summary>

```JavaScript
var subject = {
  greetings1: [
    "Good Afternoon"
  ],
  greetings2: [
    "Good Morning"
  ]
};

strategies.myStrategy = {
	interface: function (object) {
		runStrategy(strategies.myStrategy, {
			subjectRoot: object
		});
	},
	main: function (state) {
		// Only overwrite Primitives
		if (!state.isContainer) {
			state.tuple.subject[state.accessor] = "Hello World";
		}
	}
};

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

</details>