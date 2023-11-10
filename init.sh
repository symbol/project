#!/bin/bash

set -ex

git submodule update --init
git -C _symbol config core.sparseCheckout true
echo 'jenkins/*' >>.git/modules/_symbol/info/sparse-checkout
echo 'linters/*' >>.git/modules/_symbol/info/sparse-checkout
git submodule update --force --checkout _symbol

# Windows recreate symlinks to jenkins and linters
if [ "$(uname -o)" = "Msys" ]; then
	echo "Recreating symlinks to jenkins and linters"
	rm jenkins linters
	ln -s _symbol/jenkins jenkins
    ln -s _symbol/linters linters
fi