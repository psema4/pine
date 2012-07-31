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

apt-get install curl xorg nodejs openssh-server

# Install rpi-update (https://github.com/Hexxeh/rpi-update/)
wget http://goo.gl/1BOfJ -O /usr/bin/rpi-update && chmod +x /usr/bin/rpi-update


####### INSTALL CHROMIUM

# Install Hexxeh's Chromium. (http://hexxeh.net/?p=328117859)
bash <(curl -sL http://goo.gl/go5yx)


####### SSH

# Make a safe backup.
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.original
sudo chmod a-w /etc/ssh/sshd_config.original


####### PERFORMANCE HACKS

# Tweak the RPi memory allocation.  Reboot for this to take effect.
rpi-update 224


####### PINE USER CREATION

# Create the user "pine-user"
useradd -m -s /bin/bash pine-user

# Set up pine-user's .bashrc file.

echo \
"node pine.js &
startx /opt/google/chrome/chrome --kiosk --disable-ipv6 --window-size=640,480 http://127.0.0.1:4444/" \
| cat > /home/pine-user/.bashrc


######## NODE APP BOOTSTRAP

echo \
"var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Welcome to Pine.\n');
  }).listen(4444, '127.0.0.1');" \
| cat > /home/pine-user/pine.js
