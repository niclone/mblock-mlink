"use strict";
var os = require("os"),
    isIPv4 = function(r) {
        return "IPv4" === r.family || 4 === r.family
    },
    getNetInterface = function() {
        var r = os.networkInterfaces();
        if (r.en0) {
            var t = r.en0.find(function(r) {
                return isIPv4(r)
            });
            if (t) return t
        }
        for (var n in r) {
            var e = (r[n] || []).find(function(r) {
                return isIPv4(r) && !r.internal && "127.0.0.1" !== r.address
            });
            if (e) return e
        }
        return []
    },
    getBroadcastAddress = function() {
        var r = getNetInterface();
        if (r && r.address && r.netmask) {
            var t = r.address,
                n = r.netmask,
                e = t.split(".").map(function(r) {
                    return Number(r)
                }),
                a = n.split(".").map(function(r) {
                    return Number(r)
                }),
                i = e.map(function(r, t) {
                    return (r & a[t]).toString(2)
                }).map(function(r) {
                    return new Array(8 - r.length).fill(0).join("") + r
                });
            return a.map(function(r) {
                return (255 - r).toString(2)
            }).forEach(function(r, t) {
                if ("0" !== r)
                    for (var n = r.length, e = 0; e < n; e++) {
                        var a = i[t].split("");
                        a[7 - e] = 1, i[t] = a.join("")
                    }
            }), i.map(function(r) {
                return parseInt(r, 2)
            }).join(".") || ""
        }
        return "255.255.255.255"
    };
module.exports = {
    getNetInterface: getNetInterface,
    getBroadcastAddress: getBroadcastAddress
};
