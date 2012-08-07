# Auto-Pine

## Dependencies

* [aria2c (Cross-platform command line bittorrent client)](http://sourceforge.net/apps/trac/aria2/wiki/Download)
* [QEMU](http://www.qemu.org/)


## Synopsis

### Config

```
vim defaults/boot/cmdline.txt # edit IP address for NFS server
```

### Build

If you already have *this* source image archive:

[[Source](http://www.raspberrypi.org/downloads)] 2012-07-15-wheezy-raspbian.zip [[Direct](http://downloads.raspberrypi.org/images/raspbian/2012-07-15-wheezy-raspbian/2012-07-15-wheezy-raspbian.zip)] [[Torrent (Preferred)](http://downloads.raspberrypi.org/images/raspbian/2012-07-15-wheezy-raspbian/2012-07-15-wheezy-raspbian.zip.torrent)] SHA-1:`3947412babbf63f9f022f1b0b22ea6a308bb630c`

Then:
* Move or copy the image archive into the distro folder
* `sudo bin/unpack.sh`

Otherwise: `sudo bin/download.sh`

If you want to time the build process:

```
time sudo bin/unpack.sh

# or

time sudo bin/download.sh
```

### Edit

1. `sudo ./start-edit-session.sh`
1. Edit files under `/mnt/pine-distro-loop/`
 1. If using NFS, copy any files you want to keep from `/opt/pine-distro-nfs/` to `/mnt/pine-distro-loop/`
1. `sudo ./stop-edit-session.sh`
1. If using NFS:
 1. `./reload-nfs.sh`

### Write to SD Card

Run one (or both) of the following to generate `pine-sd.img` and/or `pine-sd-nfs.img` in the distro folder. See the [RPi Easy SD Card Setup guide](http://elinux.org/RPi_Easy_SD_Card_Setup) to learn how to write these generated image files to your SD card.

##### No NFS

```
./mksd
```

##### NFS

```
./mksd-nfs
```

