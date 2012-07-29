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

apt-get install curl xorg mate-core mate-desktop-environment nodejs

# Install rpi-update (https://github.com/Hexxeh/rpi-update/)
wget http://goo.gl/1BOfJ -O /usr/bin/rpi-update && chmod +x /usr/bin/rpi-update


####### INSTALL CHROMIUM

# Install Hexxeh's Chromium. (http://hexxeh.net/?p=328117859)
bash <(curl -sL http://goo.gl/go5yx)


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
