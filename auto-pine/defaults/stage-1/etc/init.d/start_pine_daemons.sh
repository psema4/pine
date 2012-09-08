#!/bin/sh
# Taken from: http://www.debian-administration.org/articles/28
case "$1" in
  start)
    input-event-daemon
    echo "Running input-event-daemon"
    ;;
  stop)
    echo "TODO: Kill input-event-daemon"
    ;;
  *)
    echo "Usage: sh /etc/init.d/start_pine_daemons.sh {start|stop}"
    exit 1
    ;;
esac

exit 0
