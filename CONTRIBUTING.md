# :pencil2: Contributing
## Pre-requisites
- `node`
- `make`

### Testing
> The makefile installs a local copy of `jasmine` to run tests.

**Node Tests**: `make test`

**Browser Tests**: Open `SpecRunner.html` in a web browser.

### Building
> The makefile installs a local copy of `uglify-es` for beautification/minification.

**Production Build**: `make prod`
Saves comment-less and minified versions of `src/differentia.js` into a `prod-build` directory.

### Clean Build/Test
Add `clean` at the end to remove `node_modules` afterwards.