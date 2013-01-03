#!/usr/bin/env bash

# DEPENDS: Cross platform command line bt client: <http://www.webupd8.org/2009/10/aria2-cross-platform-command-line-tool.html>

#config
aria=`which aria2c`
WD="./distro"
#SRCURL="http://downloads.raspberrypi.org/images/raspbian/2012-07-15-wheezy-raspbian/2012-07-15-wheezy-raspbian.zip.torrent"
SRCURL="http://downloads.raspberrypi.org/images/raspbian/2012-09-18-wheezy-raspbian/2012-09-18-wheezy-raspbian.zip.torrent"

echo "Auto Pine 0.0"
echo "Download"
echo ""
echo "Using"
echo "  - Aria:    ${aria}"
echo "  - Workdir: ${WD}"
echo "  - Source:  ${SRCURL}"
echo ""

if [ ! -d "${WD}" ]; then
    echo "creating distribution folder..."
    mkdir ${WD}
fi

echo "downloading..."
${aria} -d "${WD}" --seed-time=0 --on-bt-download-complete=./bin/unpack.sh -l "aria.log" --log-level warn ${SRCURL}
