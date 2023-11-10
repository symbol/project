#!/bin/bash

set -ex

"$(git rev-parse --show-toplevel)/linters/python/lint.sh"