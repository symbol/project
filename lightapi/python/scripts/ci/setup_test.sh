#!/bin/bash

set -ex

# Windows, copy openssl dlls to the local folder
if [ "$(uname -o)" = "Msys" ]; then
    cp "$OPENSSL_ROOT_DIR"/*.dll symbollightapi/bindings
fi
