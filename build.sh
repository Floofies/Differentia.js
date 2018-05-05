#!/bin/bash
echo "Building Differentia in prod-build..."
browserify ./src/index.js -o ./prod-build/dist/differentia.js -s differentia\
&& uglifyjs ./prod-build/dist/differentia.js -o ./prod-build/dist/differentia.min.js\
&& cp README.md prod-build/\
&& cp LICENSE prod-build/\
&& cp package.json prod-build/\
&& cp -r src prod-build/\
&& cp -r spec prod-build/\
&& echo "OK"