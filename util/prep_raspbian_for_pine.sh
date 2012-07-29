#!/bin/bash

# Run in Raspbian.
#
# Sets up Raspbian environment and gets packages for Pine.


####### SET UP SOURCES
echo \
"deb http://archive.raspbian.org/raspbian wheezy main contrib non-free rpi
deb-src http://archive.raspbian.org/raspbian wheezy main contrib non-free rpi
deb http://archive.raspbian.org/mate wheezy main" \
| cat > /etc/apt/sources.list

# Add GPG key
wget http://archive.raspbian.org/raspbian.public.key -O - | sudo apt-key add -

apt-get update


####### GET DEPENDENCIES

apt-get install curl xorg mate-core mate-desktop-environment

# Install rpi-update (https://github.com/Hexxeh/rpi-update/)
wget http://goo.gl/1BOfJ -O /usr/bin/rpi-update && chmod +x /usr/bin/rpi-update


####### INSTALL CHROMIUM

# Install Hexxeh's Chromium. (http://hexxeh.net/?p=328117859)
bash <(curl -sL http://goo.gl/go5yx)


####### INSTALL NODE

# Install Git and Node. Adapted from:
#   http://www.convery.me.uk/blog/install-node-js-v0-8-2-on-raspbian/
sudo apt-get install git-core build-essential

cd ~/

# Download the source and patch it
git clone git://github.com/gflarity/node_pi.git
git clone git://github.com/joyent/node.git
cd node
git checkout origin/v0.8.2-release -b v0.8.2-release
git apply --stat ../node_pi/v0.8.2-release-raspberrypi.patch

#Set the flags needed for compilation
export GYP_DEFINES="armv7=0"
export CXXFLAGS='-march=armv6 -mfpu=vfp -mfloat-abi=hard -DUSE_EABI_HARDFLOAT'
export CCFLAGS='-march=armv6 -mfpu=vfp -mfloat-abi=hard -DUSE_EABI_HARDFLOAT'

# Configure the compilation
./configure --shared-openssl --without-snapshot

# Make & install
make
sudo GYP_DEFINES="armv7=0" CXXFLAGS='-march=armv6 -mfpu=vfp -mfloat-abi=hard -DUSE_EABI_HARDFLOAT' CCFLAGS='-march=armv6 -mfpu=vfp -mfloat-abi=hard -DUSE_EABI_HARDFLOAT' make install


####### PERFORMANCE HACKS

# Tweak the RPi memory allocation.  Reboot for this to take effect.
rpi-update 224


####### PINE USER CREATION

# Create the user "pine-user"
useradd -m -s /bin/bash pine-user

# Set up the pine-user's init file.
echo "exec mate-session" | cat > /home/pine-user/.xinitrc

su pine-user
start x
