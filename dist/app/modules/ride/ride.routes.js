"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const ride_controller_1 = require("./ride.controller");
const router = (0, express_1.Router)();
router.post("/create", (0, checkAuth_1.checkAuth)([user_interface_1.ERole.rider]), ride_controller_1.rideController.createRide);
router.post("/discount", (0, checkAuth_1.checkAuth)([user_interface_1.ERole.admin]), ride_controller_1.rideController.adminSendDiscountOTP);
//! Driver
router.post("/accept-ride", (0, checkAuth_1.checkAuth)([user_interface_1.ERole.driver]), ride_controller_1.rideController.acceptRideByDriver);
router.post("/start-ride", (0, checkAuth_1.checkAuth)([user_interface_1.ERole.driver]), ride_controller_1.rideController.startRideByDriver);
router.post("/complete-ride", (0, checkAuth_1.checkAuth)([user_interface_1.ERole.driver]), ride_controller_1.rideController.completeRideByDriver);
//! Rider
router.post("/cancel-ride", (0, checkAuth_1.checkAuth)([user_interface_1.ERole.rider]), ride_controller_1.rideController.cancelRideByRider);
router.get("/get-all", ride_controller_1.rideController.findAllRidesData);
router.get("/get/:id", ride_controller_1.rideController.singleRideData);
exports.rideRoutes = router;
