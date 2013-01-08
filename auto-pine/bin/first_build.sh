#!/usr/bin/env bash

# sanity check
if [[ $UID -ne 0 ]]; then
  echo "$0 must be run as root"
  exit 1
fi

#config
WD="./distro"
SRC_IMG="${WD}/2012-12-16-wheezy-raspbian.img"
DST_IMG="${WD}/pine.img"
DST_SWAP="${WD}/pine.hdb"

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
mount -v -o loop,offset=${IMG_OFFSET} ${SRC_IMG} ${PINE_IMGDIR}

echo ""
echo "modifying filesystem image"

# stage 1
mv ${PINE_IMGDIR}/etc/inittab ${PINE_IMGDIR}/etc/inittab.orig
mv ${PINE_IMGDIR}/etc/fstab ${PINE_IMGDIR}/etc/fstab.orig
rm -v ${PINE_IMGDIR}/etc/profile.d/raspi-config.sh
cp -av ./defaults/stage-1/etc/inittab ${PINE_IMGDIR}/etc/inittab
echo "/dev/hdb   swap    swap    defaults    0   0" >> ${PINE_IMGDIR}/etc/fstab
cp -av ./defaults/stage-1/root/.bashrc ${PINE_IMGDIR}/root/.bashrc
cp -rav ./defaults/stage-1/root/setup ${PINE_IMGDIR}/root
cp -av ./defaults/stage-1/etc/init.d/start_pine_daemons.sh ${PINE_IMGDIR}/etc/init.d/start_pine_daemons.sh

echo ""
echo "setting permissions"
chown -vR root.root ${PINE_IMGDIR}/root
chown -v root.root ${PINE_IMGDIR}/etc/inittab

echo ""
echo "finalizing filesystem image"
umount -v ${PINE_IMGDIR}

echo ""
echo "sleep 2"
sleep 2

echo ""
echo "creating Pine image"
mv -v ${SRC_IMG} ${DST_IMG}

# get boot partitions
#./bin/boot_parts.sh

if [ ! -f "${DST_SWP}" ]; then
    echo ""
    echo "VM swap partition not found, creating"
    qemu-img create -f raw ${DST_SWAP} 256M
fi

echo ""
echo "Running first boot, hda=${DST_IMG} , hdb=${DST_SWAP} (swap)"
qemu-system-arm -kernel ./kernel-qemu.1176 -cpu arm1176 -M versatilepb -no-reboot -append "root=/dev/sda2 panic=1" -hda ${DST_IMG} -hdb ${DST_SWAP}

echo ""
echo "Stage: 2 (Pine Setup)"
echo ""

echo "mounting source image"
mount -o loop,offset=${IMG_OFFSET} ${DST_IMG} ${PINE_IMGDIR}

# stage 2
cp -av ./defaults/stage-2/etc/inittab ${PINE_IMGDIR}/etc/inittab
cp -av ./defaults/stage-2/home/* ${PINE_IMGDIR}/home/

echo "" 
echo "setting permissions"
chown -vR 1001:1002 ${PINE_IMGDIR}/home/pine-user

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
echo "./pine.sh"

echo "#!/usr/bin/env bash" > pine.sh
echo "qemu-system-arm -kernel ./kernel-qemu.1176 -cpu arm1176 -M versatilepb -append \"root=/dev/sda2 panic=1\" -hda ${DST_IMG} -hdb ${DST_SWAP}" >> pine.sh
chmod 744 pine.sh

