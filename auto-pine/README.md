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

If you already have a source image:

* Move or copy into the distro folder
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
 1. If using NFS, opy any files you want to keep from `/opt/pine-distro-nfs/` to `/mnt/pine-distro-loop/`
1. `sudo ./stop-edit-session.sh`
1. If using NFS:
 1. `./reload-nfs.sh`

### Write to SD Card

See the [RPi Easy SD Card Setup guide](http://elinux.org/RPi_Easy_SD_Card_Setup) to learn how to write the generated image files to your SD card.

##### No NFS

```
./mksd
```

##### NFS

```
./mksd-nfs
```

