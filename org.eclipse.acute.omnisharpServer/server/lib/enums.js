"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DriverState;
(function (DriverState) {
    DriverState[DriverState["Disconnected"] = 0] = "Disconnected";
    DriverState[DriverState["Downloading"] = 1] = "Downloading";
    DriverState[DriverState["Downloaded"] = 2] = "Downloaded";
    //Bootstrapping,
    //Bootstrapped,
    DriverState[DriverState["Connecting"] = 3] = "Connecting";
    DriverState[DriverState["Connected"] = 4] = "Connected";
    DriverState[DriverState["Error"] = 5] = "Error";
})(DriverState = exports.DriverState || (exports.DriverState = {}));
var Runtime;
(function (Runtime) {
    Runtime[Runtime["ClrOrMono"] = 0] = "ClrOrMono";
    Runtime[Runtime["CoreClr"] = 1] = "CoreClr";
})(Runtime = exports.Runtime || (exports.Runtime = {}));
function isPluginDriver(driver) { return !!driver.updatePlugins; }
exports.isPluginDriver = isPluginDriver;
//# sourceMappingURL=/home/mistria/git/aCute/org.eclipse.acute.omnisharpServer/server/lib/enums.js.map