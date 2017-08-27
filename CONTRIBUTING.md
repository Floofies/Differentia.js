# :pencil2: Contributing
## Prerequisites
- `node`
- `jasmine`
- `uglify-es`
- `make`

### Testing
**Node Tests**: `make test`
**Browser Tests**: Open `SpecRunner.html` in a web browser.

### Building
**Production Build**: `make prod`
Saves comment-less and minified versions of `src/differentia.js` into a `prod-build` directory.

### Clean Build/Test
Add `clean` at the end to remove `node_modules` afterwards.