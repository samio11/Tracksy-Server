"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERideStatus = void 0;
var ERideStatus;
(function (ERideStatus) {
    ERideStatus["requested"] = "requested";
    ERideStatus["pending"] = "pending";
    ERideStatus["accepted"] = "accepted";
    ERideStatus["arrived"] = "arrived";
    ERideStatus["started"] = "started";
    ERideStatus["completed"] = "completed";
    ERideStatus["cancelled"] = "cancelled";
    ERideStatus["no_driver"] = "no_driver";
})(ERideStatus || (exports.ERideStatus = ERideStatus = {}));
