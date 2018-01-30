noargs :
	@printf "\
	╭─────────────────────────────────────────╮\n\
	│      Differentia.js Build Options       │\n\
	├─────────────────────────────────────────┤\n\
	│ ▶ Run Tests:          'make test'       │\n\
	│ ▶ Production Build:   'make prod'       │\n\
	│ ▶ Clean Build:        'make prod clean' │\n\
	╰─────────────────────────────────────────╯\n\n"

node_modules/uglify-es/bin/uglifyjs :
	@printf "Downloading uglifyjs from GitHub...\n"
	@npm i github:mishoo/UglifyJS2#harmony --save-dev
node_modules/jasmine/bin/jasmine.js :
	@printf "Downloading jasmine from NPM...\n"
	@npm i jasmine --save-dev
prod-build :
	@mkdir prod-build
	@mkdir prod-build/dist
prod-build/dist/differentia.js : node_modules/uglify-es/bin/uglifyjs prod-build src/header.js src/core.js src/strategies.js src/structs src/footer.js
	@printf "Building dist/differentia.js"
	@rm -f prod-build/dist/differentia.js
	@touch prod-build/dist/differentia.js
	@cat src/header.js src/core.js src/strategies.js src/structs/*.js src/footer.js >> prod-build/dist/differentia.js
	@node_modules/uglify-es/bin/uglifyjs -b -o prod-build/dist/differentia.js prod-build/dist/differentia.js
	@printf "      \x1b[32;01m[OK]\x1b[0m\n"
prod-build/dist/differentia.min.js : node_modules/uglify-es/bin/uglifyjs prod-build/dist/differentia.js
	@printf "Building dist/differentia.min.js"
	@rm -f prod-build/dist/differentia.min.js
	@touch prod-build/dist/differentia.min.js
	@node_modules/uglify-es/bin/uglifyjs -o prod-build/dist/differentia.min.js prod-build/dist/differentia.js
	@printf "      \x1b[32;01m[OK]\x1b[0m\n"
prod : src/header.js src/core.js src/strategies.js src/structs src/footer.js prod-build/dist/differentia.js prod-build/dist/differentia.min.js
	@rm -drf prod-build/src
	@rm -drf prod-build/spec
	@cp -r src prod-build/src
	@cp -r spec prod-build/spec
	@cp README.md prod-build/README.md
	@cp package.json prod-build/package.json
	@printf "Build Done! ･ω･\n"
test : node_modules/jasmine/bin/jasmine.js prod-build/dist/differentia.js
	@printf "Running tests...\n"
	@node node_modules/jasmine/bin/jasmine.js spec/Spec.js
clean :
	@printf "Cleaning up...\n"
	@rm -dr node_modules