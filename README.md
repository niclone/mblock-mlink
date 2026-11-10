# mblock-mlink
Multiplatform version of mblock-mlink tool

The source code comes from
- http://www.mblock.cc/mblock-software/
- https://dl.makeblock.com/mblock5/linux/mLink-1.2.0-amd64.deb
- https://dl.makeblock.com/mblock5/linux/mLink-1.2.0-1.el7.x86_64.rpm
- https://dl.makeblock.com/mblock5/win32/mLinkSetup.exe
- https://dl.makeblock.com/mblock5/darwin/mLink.pkg

Changes are
- beautify javascript source
- it does not include external modules
- it does not include the node executable
- non platform specific
- can be installed and run as a node application

It is not clear why the Windows/MacOS and Linux versions are slightly different: I don't know which one is more recent, and being node.js apps, they work on all platforms anyway.
The Linux app seems to do a wifi scan as well, a feature not present in the other 2.

## Run

Requires Node.js 18 or newer.

```
npm install
node .
```

The application listens for mBlock clients on TCP port 55278 and serves its
local files on port 34433.

### Verbose logging

By default only the file log is written to `~/mlink/logs/runtime.log`. To also
print debug messages to the console:

```
node . --verbose
# or
npm run start:verbose
```

The same can be enabled with `NODE_ENV=dev node .` or `MLINK_VERBOSE=1 node .`.

To change the log level (`trace`, `debug`, `info`, `warn`, `error`):

```
MLINK_LOG_LEVEL=trace node .
```

### Bluetooth LE on Linux

BLE scanning uses BlueZ through D-Bus by default, so it works without running
mLink as root. If your adapter or BlueZ setup needs the raw HCI backend instead:

```
NOBLE_BINDINGS=hci node .
```

The raw HCI backend requires additional capabilities, for example:

```
sudo setcap cap_net_raw+eip "$(readlink -f "$(which node)")"
```

To confirm that BLE scanning works and your mBot is broadcasting, look for
`Makeblock_LE...` in the verbose output or in `bluetoothctl devices`.

If the mBot is listed but connections immediately fail with
`disconnected: remote`, a stale Bluetooth pairing/bond can cause this. Remove
the pairing and reconnect:

```bash
bluetoothctl devices | grep -i Makeblock
bluetoothctl remove <device MAC>
```

mLink does not require pairing/bonding for the mBot BLE protocol.
