#!/usr/bin/env bash

# sanity check
if [[ $UID -ne 0 ]]; then
  echo "$0 must be run as root"
  exit 1
fi

#config
WD="./distro"
SRC_IMG="${WD}/pine.img"
PINE_IMGDIR="/mnt/pine-distro-loop"         # pine filesystem mount point
NFS_PINEDIR="/opt/pine-distro-nfs"          # nfs server's image

IMG_BS=512
IMG_START=122880
IMG_END=3788799
IMG_OFFSET=62914560 # IMG_BS * IMG_START

# all builds
echo "Auto Pine 0.0"
echo "Reload NFS"
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
mount -o loop,offset=${IMG_OFFSET} ${SRC_IMG} ${PINE_IMGDIR}

echo ""
echo "copying Pine image"
cp -rav ${PINE_IMGDIR}/* ${NFS_PINEDIR}/

echo ""
echo "closing Pine image"
umount ${PINE_IMGDIR}

echo ""
echo "cleaning up mount points"
rmdir ${PINE_IMGDIR}
