#!/bin/bash

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
