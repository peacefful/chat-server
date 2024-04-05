"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidateDatas = void 0;
const express_validator_1 = require("express-validator");
const checkValidateDatas = (property, min, max) => {
    return (0, express_validator_1.body)(property).trim().isLength({ min: min, max: max }).withMessage('Error, incorrect data');
};
exports.checkValidateDatas = checkValidateDatas;
