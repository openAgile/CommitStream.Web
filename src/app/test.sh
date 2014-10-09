#!/usr/bin/sh
export PATH=$(pwd)/node_modules/.bin:$PATH

# Compile code from ES6 to ES5 before test
find . -name '__tests' ! -path './node_modules/*' -exec sh -c 'mkdir -p $1__ && traceur --modules commonjs --dir $1 $1__/ ' - {} \;

npm test