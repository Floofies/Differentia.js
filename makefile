noargs :
	@printf "+------------------------------+\n| Differentia.js Build Options |\n+------------------------------+\n-> Run Tests: 'make test'\n-> Production Build: 'make prod'\n-> Clean Build: 'make prod clean'\n"

node_modules/uglify-es/bin/uglifyjs :
	@printf "Downloading uglifyjs from GitHub...\n"
	@npm i github:mishoo/UglifyJS2#harmony --save-dev
node_modules/jasmine/bin/jasmine.js :
	@printf "Downloading jasmine from NPM...\n"
	@npm i jasmine --save-dev
test : node_modules/jasmine/bin/jasmine.js
	@printf "Running tests..."
	@node node_modules/jasmine/bin/jasmine.js spec/Spec.js
prod-build :
	@mkdir prod-build
dist : prod-build
	@mkdir prod-build/dist
src : prod-build
	@mkdir prod-build/src
prod : node_modules/uglify-es/bin/uglifyjs prod-build dist
	@printf "Building Production version in prod-build...\n"
	@node_modules/uglify-es/bin/uglifyjs -b -o prod-build/dist/differentia.js src/differentia.js
	@node_modules/uglify-es/bin/uglifyjs -o prod-build/dist/differentia.min.js src/differentia.js
	@cp src/differentia.js prod-build/src/differentia.js
	@cp package.json prod-build/package.json
	@cp README.md prod-build/README.md
	@cp spec prod-build/spec
	@printf "Done! ･ω･\n"
clean :
	@printf "Cleaning up...\n"
	@rm -dr node_modules