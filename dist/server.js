"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
const app_1 = __importDefault(require("./app"));
const redis_config_1 = require("./app/config/redis.config");
let server;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.DATABASE);
            server = app_1.default.listen(config_1.default.PORT, () => {
                console.log(`Server runs on port :- ${config_1.default.PORT}✨`);
            });
        }
        catch (err) {
            console.log("Internal server error", err);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, redis_config_1.redisConnection)();
}))();
process.on("uncaughtException", (err) => {
    console.log("UnCaught Exception", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("unhandledRejection", (err) => {
    console.log("UnHandled Rejection", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("Signal Termination");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
