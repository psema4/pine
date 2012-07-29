#!/bin/bash

# CREATES A DIRECTORY AT ~/rpi/chroot-raspbian-armhf

# This _gets_ the Raspbian rootfs and prepares it for development.  This is to
# be run from a development environment, NOT the Raspberry Pi itself.

# For Ubuntu.  Probably works elsewhere too.
#
# This script downloads the Raspbian file system into:
#   ~/rpi/chroot-raspbian-armhf
#
# It also chroots you into the directory, so you can act as a Raspbian user.
#
# This was all taken from here:
#   http://superpiadventures.com/2012/07/development-environment/

mkdir -p ~/rpi
cd ~/rpi

# Get some packages.
sudo apt-get install qemu-user-static debootstrap

# This step takes a little while.  Don't do it on a low battery.
sudo qemu-debootstrap --arch armhf wheezy chroot-raspbian-armhf http://archive.raspbian.org/raspbian

# Mount some filesystems.  These calls to "mount" need to be done again after
# rebooting, so CONSIDER MAKING A BASH ALIAS.
Sudo mount -t proc proc ~/rpi/chroot-raspbian-armhf/proc
sudo mount -t sysfs sysfs ~/rpi/chroot-raspbian-armhf/sys
sudo mount -o bind /dev ~/rpi/chroot-raspbian-armhf/dev

# chroot into the Raspbian filesystem
# Do this each time you need to work with the Raspbian files.
# Again, CONSIDER MAKING A BASH ALIAS.
sudo LC_ALL=C chroot ~/rpi/chroot-raspbian-armhf
