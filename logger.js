"use strict";
var log4js = require("log4js"),
    _require = require("./constant"),
    ROUTER = _require.ROUTER,
    hasFlag = function(e) {
        return process.argv.indexOf(e) !== -1
    },
    isDev = "dev" === process.env.NODE_ENV,
    isVerbose = isDev || "1" === process.env.MLINK_VERBOSE || "true" === process.env.MLINK_LOG_CONSOLE || hasFlag("--verbose") || hasFlag("-v"),
    requestedLevel = process.env.MLINK_LOG_LEVEL,
    consoleLevel = requestedLevel || (isVerbose ? "debug" : "info"),
    fileLevel = requestedLevel || "debug",
    useConsole = isVerbose || !!requestedLevel,
    configure = {
        replaceConsole: !0,
        appenders: {
            stdout: {
                type: "console"
            },
            info: {
                type: "file",
                filename: ROUTER.MLINK_LOG_PATH + "/runtime.log",
                maxLogSize: 2048e4,
                backups: 10
            }
        },
        categories: {
            default: {
                appenders: ["stdout"],
                level: consoleLevel
            },
            info: {
                appenders: ["info"],
                level: fileLevel
            }
        }
    };
log4js.configure(configure);
var type = useConsole ? "default" : "info",
    logger = log4js.getLogger(type);
module.exports = logger;
