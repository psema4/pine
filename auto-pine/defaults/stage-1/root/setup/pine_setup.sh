#!/bin/bash

# Run in Raspbian.
# RUN THIS AS ROOT.
#
# Sets up Raspbian environment and gets packages for Pine.

if [[ $UID -ne 0 ]]; then
  echo "$0 must be run as root"
  exit 1
fi


####### SET UP SOURCES
echo
echo "*** Stage 1 ***"
echo

echo \
"deb http://archive.raspbian.org/raspbian wheezy main contrib non-free rpi
deb-src http://archive.raspbian.org/raspbian wheezy main contrib non-free rpi
deb http://archive.raspbian.org/mate wheezy main" \
| cat > /etc/apt/sources.list

# Add GPG key
wget http://archive.raspbian.org/raspbian.public.key -O - | sudo apt-key add -

apt-get update


####### GET DEPENDENCIES
echo
echo "*** Stage 2 ***"
echo

apt-get --yes --force-yes install curl xorg nodejs openssh-server git-core vim

# Install rpi-update (https://github.com/Hexxeh/rpi-update/)
wget http://goo.gl/1BOfJ -O /usr/bin/rpi-update && chmod +x /usr/bin/rpi-update

# Install input-event-daemon
git clone git://github.com/gandro/input-event-daemon.git /usr/local/lib/input-event-daemon
cd /usr/local/lib/input-event-daemon
make
make install


####### INSTALL CHROMIUM
echo
echo "*** Stage 3 ***"
echo

# Install Hexxeh's Chromium. (http://hexxeh.net/?p=328117859)
#bash <(curl -sL http://goo.gl/go5yx) # BROKEN

### COPY OF install_chromium.sh STARTS ###
# From http://hexxeh.net/?p=328117859
sudo apt-get install -y --force-yes libnss3 libxrender1 libxss1 libgtk2.0-0 libgconf2-4
sudo mkdir -p /opt/google/
cd /opt/google
sudo wget http://distribution-us.hexxeh.net/chromium-rpi/chromium-rpi-r22.tar.gz -O chromium-rpi.tar.gz
sudo tar xvf chromium-rpi.tar.gz
sudo chown root:root chrome/chrome-sandbox
sudo chmod 4755 chrome/chrome-sandbox
sudo rm -rf /usr/bin/chrome
sudo ln -s /opt/google/chrome/chrome /usr/bin/chrome
### COPY OF install_chromium.sh ENDS ###

####### SSH
echo
echo "*** Stage 4 ***"
echo

# Make a safe backup.
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.original
chmod a-w /etc/ssh/sshd_config.original


####### PERFORMANCE HACKS
echo
echo "*** Stage 5 ***"
echo

# Tweak the RPi memory allocation.  Reboot for this to take effect.
rpi-update 224


####### PINE USER CREATION
echo
echo "*** Stage 6 ***"
echo

# Create the user "pine-user"
useradd -m -s /bin/bash pine-user

# Files copied in via auto-pine stage 2

####### BOOTUP
echo
echo "*** Stage 7 ***"
echo

# At bootup, login as pine-user without a password prompt.
# http://www.debianadmin.com/how-to-auto-login-and-startx-without-a-display-manager-in-debian.html
# It looks fancy.  It's just a find-and-replace.
cp /etc/inittab /etc/inittab.original

#sed -i 's/1:2345:respawn:\/sbin\/getty 38400 tty1/#1:2345:respawn:\/sbin\/getty 38400 tty1\n1:2345:respawn:\/bin\/login -f pine-user tty1 <\/dev\/tty1 >\/dev\/tty1 2>\&1/' /etc/inittab
#perl -pi -e 's/1:2345:respawn:\/sbin\/getty 38400 tty1/#1:2345:respawn:\/sbin\/getty 38400 tty1\n1:2345:respawn:\/bin\/login -f pine-user tty1 <\/dev\/tty1 >\/dev\/tty1 2>\&1/' /etc/inittab

####### INPUT DAEMON

echo
echo "*** Stage 8 ***"
echo

echo \
"[Global]
listen = /dev/input/event0
listen = /dev/input/event1

[Keys]
ESC = sh /home/pine-user/kill_chrome.sh" \
| cat > /etc/input-event-daemon.conf

cd /etc/init.d/
chmod 755 start_pine_daemons.sh
update-rc.d start_pine_daemons.sh defaults

echo
echo "*** FINISHED***"
echo "Reboot to run Pine"
echo
reboot
