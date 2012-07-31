#!/bin/bash

# To be run inside of Raspbian.  Assumes prep_raspbian_for_pine.sh has been
# run.  Exit with alt + F4.

startx /opt/google/chrome/chrome --kiosk --disable-ipv6 --window-size=640,480 http://127.0.0.1:1337/
