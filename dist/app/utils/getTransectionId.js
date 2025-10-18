"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransectionId = void 0;
const getTransectionId = () => {
    return `trn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
exports.getTransectionId = getTransectionId;
