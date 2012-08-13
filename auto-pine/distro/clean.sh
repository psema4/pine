#!/usr/bin/env bash

# destroy existing pine images
rm -f *.img
rm -f *.part

if [ -f ../pine.sh ]; then
    rm ../pine.sh
fi

echo "run unpack to create a new pine distro"
