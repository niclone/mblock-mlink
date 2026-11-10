"use strict";
var logger = require("../../logger"),
    os = require("os"),
    loadFirst = function(e) {
        for (var r = 0; r < e.length; r++) try {
            return require(e[r])
        } catch (t) {
            logger.debug("BLE library ".concat(e[r], " is not available: "), t.code || t.message)
        }
        return null
    },
    withBinding = function(e, r) {
        if (!e || "function" != typeof e.withBindings) return null;
        try {
            return e.withBindings(r)
        } catch (t) {
            logger.debug("BLE binding '".concat(r, "' is not available: "), t.code || t.message);
            return null
        }
    },
    getNoble = function(e) {
        var r = null,
            t = (process.env.NOBLE_BINDINGS || "").toLowerCase();
        if ("win32" === os.platform()) {
            var o = os.release().split(".").map(Number);
            if (e || !(10 < o[0] || 10 === o[0] && 0 < o[1] || 10 === o[0] && 0 === o[1] && 15063 <= o[2])) {
                logger.debug("platform->win7:@kunz/noble-mac"), r = loadFirst(["@kunz/noble-mac", "@stoprocent/noble", "noble"])
            } else logger.debug("platform->win10:noble-uwp"), r = loadFirst(["noble-uwp", "@stoprocent/noble", "noble"])
        } else logger.debug("platform->mac/linux:@stoprocent/noble"), r = loadFirst(["@stoprocent/noble", "@abandonware/noble", "@kunz/noble-mac", "noble"]);
        if (!r) throw new Error("No Bluetooth Low Energy library is available for this platform.");
        var n = t ? withBinding(r, t) : null;
        if (n) return logger.debug("using Bluetooth binding: ".concat(t)), n;
        if ("linux" === os.platform() && !t) {
            n = withBinding(r, "dbus");
            if (n) return logger.debug("using Bluetooth binding: dbus"), n
        }
        return logger.debug("using default Bluetooth binding"), r
    };
module.exports = {
    getNoble: getNoble
};
