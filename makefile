noargs :
	@printf "+------------------------------+\n| Differentia.js Build Options |\n+------------------------------+\-> Run Tests: 'make test'\n-> Production: 'make prod'\n-> Clean Build: 'make prod clean'\n"

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
prod : node_modules/uglify-es/bin/uglifyjs prod-build
	@printf "Building Production version in prod-build...\n"
	@node_modules/uglify-es/bin/uglifyjs -b -o prod-build/differentia.js src/differentia.js
	@node_modules/uglify-es/bin/uglifyjs -o prod-build/differentia.min.js src/differentia.js
	@printf "Done! ･ω･\n"
clean :
	@printf "Cleaning up...\n"
	@rm -dr node_modules