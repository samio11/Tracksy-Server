"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
exports.rootRouter = (0, express_1.Router)();
const excludingRouter = [
    {
        path: "/auth",
        element: auth_routes_1.authRoutes,
    },
];
excludingRouter.forEach((x) => exports.rootRouter.use(x.path, x.element));
