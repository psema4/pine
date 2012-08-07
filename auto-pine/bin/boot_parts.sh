#!/usr/bin/env bash

# sanity check
if [[ $UID -ne 0 ]]; then
  echo "$0 must be run as root"
  echo ""
  exit 1
fi

#config
WD="./distro"
SRC_IMG="${WD}/pine.img"

BOOT_BS=512
BOOT_START=8192
BOOT_END=122879
BOOT_OFFSET=4194304 # BOOT_BS * BOOT_START

IMG_BS=512
IMG_START=122880
IMG_END=3788799
IMG_OFFSET=62914560 # IMG_BS * IMG_START

BOOT_IMGDIR="/mnt/raspbian-boot-loop"       # mount point for SD card boot images

echo "Auto Pine 0.0"
echo "Boot Images"
echo ""

if [ ! -f $SRC_IMG ]; then
    echo "No source image. run unpack.sh or download.sh again."
    echo ""
    exit 1
fi

if [ ! -d ${BOOT_IMGDIR} ]; then
    mkdir ${BOOT_IMGDIR}
fi


echo "extracting original boot partition"
dd if=${SRC_IMG} of=${WD}/sd-boot.part bs=${BOOT_BS} seek=${BOOT_START} count=${BOOT_END}

echo ""
echo "mounting boot image"
mount -o loop,offset=${BOOT_OFFSET} ${SRC_IMG} ${BOOT_IMGDIR}

echo ""
echo "modifying image"
cp ./defaults/boot/cmdline.txt ${BOOT_IMGDIR}/cmdline.txt

echo ""
echo "finalizing image"
umount ${BOOT_IMGDIR}

echo ""
echo "extracting SD+NFS boot partition"
dd if=${SRC_IMG} of=${WD}/sd-nfs-boot.part bs=${BOOT_BS} seek=${BOOT_START} count=${BOOT_END}

echo ""
echo "cleaning up mount points"
rmdir ${BOOT_IMGDIR}
