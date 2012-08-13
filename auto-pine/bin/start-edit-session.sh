#!/usr/bin/env bash

# sanity check
if [[ $UID -ne 0 ]]; then
  echo "$0 must be run as root"
  exit 1
fi

#config
WD="./distro"
SRC_IMG="${WD}/pine.img"

IMG_BS=512
IMG_START=122880
IMG_END=3788799
IMG_OFFSET=62914560 # IMG_BS * IMG_START

PINE_IMGDIR="/mnt/pine-distro-loop"         # pine filesystem mount point

echo "Auto Pine 0.0"
echo "Start edit session"
echo ""

if [ ! -f $SRC_IMG ]; then
    echo "No source image. run unpack.sh or download.sh again."
    echo ""
    exit 1
fi

if [ ! -d ${PINE_IMGDIR} ]; then
    mkdir ${PINE_IMGDIR}
fi

echo "mounting source image"
mount -vo loop,offset=${IMG_OFFSET} ${SRC_IMG} ${PINE_IMGDIR}

echo ""
echo "You may now edit the filesystem under ${PINE_IMGDIR}"
echo ""
echo "Don't forget to run stop-edit-session.sh in this folder when finished!"
echo ""
