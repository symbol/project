#!/bin/bash

set -ex

python3 -m pip install -r "$(git rev-parse --show-toplevel)/linters/python/lint_requirements.txt"
python3 -m pip install -r requirements.txt
python3 -m pip install -r dev_requirements.txt

# build bindings as part of lint setup to avoid import-error
python3 -m cffi_src.openssl_build

# move all files from the build
/usr/bin/find build/ -type f -exec mv {} symbollightapi/bindings/ \;
