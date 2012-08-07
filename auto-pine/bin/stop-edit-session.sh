#!/usr/bin/env bash

# sanity check
if [[ $UID -ne 0 ]]; then
  echo "$0 must be run as root"
  exit 1
fi

#config
#WD="./distro"
#SRC_IMG="${WD}/pine.img"
PINE_IMGDIR="/mnt/pine-distro-loop"         # pine filesystem mount point

# all builds
echo "Auto Pine 0.0"
echo "Stop Edit Session"
echo ""

echo "finalizing filesystem image"
umount ${PINE_IMGDIR}

echo ""
echo "cleaning up mount points"
rmdir ${PINE_IMGDIR}
