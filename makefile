noargs :
	@printf "\
	+------------------------------+\n\
	| Differentia.js Build Options |\n\
	+------------------------------+\n\
	 ▶ Run Tests: 'make test'\n\
	 ▶ Production Build: 'make prod'\n\
	 ▶ Clean Build: 'make prod clean'\n"

node_modules/uglify-es/bin/uglifyjs :
	@printf "Downloading uglifyjs from GitHub...\n"
	@npm i github:mishoo/UglifyJS2#harmony --save-dev
node_modules/jasmine/bin/jasmine.js :
	@printf "Downloading jasmine from NPM...\n"
	@npm i jasmine --save-dev
prod-build :
	@mkdir prod-build
prod-build/dist : prod-build
	@mkdir prod-build/dist
prod : node_modules/uglify-es/bin/uglifyjs prod-build/dist
	@printf "Building Production version in prod-build...\n"
	@rm -f prod-build/dist/differentia.js
	@touch prod-build/dist/differentia.js
	@cat src/header.js src/core.js src/strategies.js src/structs/*.js src/footer.js >> prod-build/dist/differentia.js
	@node_modules/uglify-es/bin/uglifyjs -b -o prod-build/dist/differentia.js prod-build/dist/differentia.js
	@node_modules/uglify-es/bin/uglifyjs -o prod-build/dist/differentia.min.js prod-build/dist/differentia.js
	@cp package.json prod-build/package.json
	@cp README.md prod-build/README.md
	@cp -r src prod-build/src
	@cp -r spec prod-build/spec
	@printf "+------------------------------+\n\
	Build Done! ･ω･\n"
test : node_modules/jasmine/bin/jasmine.js prod
	@printf "Running tests...\n"
	@node node_modules/jasmine/bin/jasmine.js spec/Spec.js
clean :
	@printf "Cleaning up...\n"
	@rm -dr node_modules