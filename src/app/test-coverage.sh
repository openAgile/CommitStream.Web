#!/usr/bin/sh
export PATH=$(pwd)/node_modules/.bin:$PATH

istanbul cover ./node_modules/mocha/bin/_mocha -- -u exports -R spec 'test/**/*tests.js'