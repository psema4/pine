#!/usr/bin/env bash

# config
WD="./distro"

BASEFN="${WD}/2012-07-15-wheezy-raspbian"
ZIPFN="${BASEFN}.zip"
RASPFN="${BASEFN}.img"
PINEFN="${WD}/pine.img"

echo "Auto Pine 0.0"
echo "Unpack"
echo ""
echo "Using:"
echo "  - Workdir:  ${WD}"
echo "  - Base:     ${BASEFN}"
echo "  - ZIP file: ${ZIPFN}"
echo "  - Raspbian: ${RASPFN}"
echo "  - Pine:     ${PINEFN}"
echo ""

# init
echo "Checking files..."

# pine image exists
if [ -f "${PINEFN}" ]; then
    echo "  - pine image exists"
else
    echo "  - pine image not found"
fi

# raspbian image exists
if [ -f "${RASPFN}" ]; then
    echo "  - raspbian image exists"
else
    echo "  - raspbian image not found"
fi

# zip exists
if [ -f "${ZIPFN}" ]; then
    echo "  - zipfile exists"
else
    echo "  - zipfile not found, aborting unpack. run ./download.sh first."
    echo ""
    exit 1
fi

echo ""
echo "Checking SHA1 signature..."
SHA1=`sha1sum ${ZIPFN}`
GOOD="3947412babbf63f9f022f1b0b22ea6a308bb630c"

if [ "${SHA1}"="${GOOD}" ]; then
    echo "SHA1 signature matches, unpacking..."
    unzip ${ZIPFN} -d ${WD}

else
    echo "Bad SHA1 signature, aborting unpack."
    echo ""
    exit 1
fi

echo ""
./bin/first_build.sh
