#!/usr/bin/env bash

set -xe

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SRC=$SCRIPT_DIR/../src
LIB=$SCRIPT_DIR/../lib

npm run babel

# Produce the bundled ES5 into /dist
npm run build:client

# Copy the LESS assets out into /lib
# cd to src so it doesn't appear in the find output
cd $SRC

ASSET_FILES=$(find . -name \*.css)

for FILE in $ASSET_FILES; do
    DIR_PATH=$(dirname $FILE)

    sudo mkdir -p $LIB/$DIR_PATH
    sudo cp $FILE $LIB/$FILE

    sudo mkdir -p $ESM/$DIR_PATH
    sudo cp $FILE $ESM/$FILE
done