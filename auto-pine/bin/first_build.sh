#!/usr/bin/env bash

# sanity check
if [[ $UID -ne 0 ]]; then
  echo "$0 must be run as root"
  exit 1
fi

#config
WD="./distro"
SRC_IMG="${WD}/2012-07-15-wheezy-raspbian.img"
DST_IMG="${WD}/pine.img"

IMG_BS=512
IMG_START=122880
IMG_END=3788799
IMG_OFFSET=62914560 # IMG_BS * IMG_START

PINE_IMGDIR="/mnt/pine-distro-loop"         # pine filesystem mount point

# all builds
echo "Auto Pine 0.0"
echo "First Build"
echo ""

if [ ! -f $SRC_IMG ]; then
    echo "No source image. run unpack.sh or download.sh again."
    echo ""
    exit 1
fi

if [ -f $DST_IMG ]; then
    echo "Pine image already exists, aborting. [Delete or rename ${DST_IMG} to start a fresh image]"
    echo ""
    exit 1
fi

if [ ! -d ${PINE_IMGDIR} ]; then
    mkdir ${PINE_IMGDIR}
fi

echo ""
echo "Stage: 1 (Install deps)"
echo ""

echo "mounting source image"
mount -o loop,offset=${IMG_OFFSET} ${SRC_IMG} ${PINE_IMGDIR}

echo ""
echo "modifying filesystem image"

# stage 1
mv ${PINE_IMGDIR}/etc/inittab ${PINE_IMGDIR}/etc/inittab.orig
cp -av ./defaults/stage-1/etc/inittab ${PINE_IMGDIR}/etc/inittab
cp -rav ./defaults/stage-1/root/setup ${PINE_IMGDIR}/root
chmod 740 ${PINE_IMGDIR}/root/setup/pine_setup.sh
echo "/root/setup/pine_setup.sh" | cat > ${PINE_IMGDIR}/root/.bashrc

echo ""
echo "finalizing filesystem image"
umount ${PINE_IMGDIR}

echo ""
echo "creating Pine image"
mv ${SRC_IMG} ${DST_IMG}


# get boot partitions
./bin/boot_parts.sh


echo ""
echo "Running first boot"
qemu-system-arm -kernel ./kernel-qemu -cpu arm1136-r2 -M versatilepb -no-reboot -append "root=/dev/sda2 panic=1" -hda ${DST_IMG}


echo ""
echo "Stage: 2 (Pine Setup)"
echo ""

echo "mounting source image"
mount -o loop,offset=${IMG_OFFSET} ${DST_IMG} ${PINE_IMGDIR}

# stage 2
cp -av ./defaults/stage-2/etc/inittab ${PINE_IMGDIR}/etc/inittab
cp -av ./defaults/stage-2/home/pine-user/* ${PINE_IMGDIR}/home/pine-user/
#echo "node pine.js & startx /opt/google/chrome/chrome --kiosk --disable-ipv6 --window-size=640,480 http://127.0.0.1:4444/" | cat > ${PINE_IMGDR}/home/pine-user/.bashrc

echo ""
echo "finalizing filesystem image"
umount ${PINE_IMGDIR}

echo ""
echo "cleaning up mount points"
rmdir ${PINE_IMGDIR}

echo ""
echo "All done"
echo ""
echo "To launch the current image:"
echo ""
echo "    qemu-system-arm -kernel ./kernel-qemu -cpu arm1136-r2 -M versatilepb -append \"root=/dev/sda2 panic=1\" -hda ${DST_IMG}"
echo ""
