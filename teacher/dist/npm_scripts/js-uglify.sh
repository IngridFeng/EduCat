#!/bin/bash
#
# NPM: Uglify Tasks
#
# These are a little too cumbersome to deal with inside NPM.
##



# Check dependencies.
command -v uglifyjs >/dev/null 2>&1 || {
	echo -e "\033[31;1mError:\033[0m uglifyjs must be in \$PATH."
	echo -e "\033[96;1mFix:\033[0m npm i uglify-es -g"
	exit 1
}



# Just one file.
cat src/js/blob-scroll.js | uglifyjs -c -m -o "blob-scroll.min.js"
echo -e "\033[2mminifying:\033[0m blob-scroll.min.js"



# We're done!
echo -e "\033[32;1mSuccess:\033[0m Uglification has completed!"
exit 0
