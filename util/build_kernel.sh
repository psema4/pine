#!/bin/bash

# RUN THIS FROM THE PINE ROOT.
# ASSUMES YOU ALREADY HAVE ALL PINE SUBMODULES CHECKED OUT.

# For Ubuntu.
# Cobbled together from:
#   http://elinux.org/RPi_Kernel_Compilation
#   http://mitchtech.net/raspberry-pi-kernel-compile/

cd dep/linux

# Get some packages
sudo apt-get install gcc-arm-linux-gnueabi make ncurses-dev

# Configure the kernel
make ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabi- bcmrpi_cutdown_defconfig

# Then build the kernel.
make ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabi- -k
