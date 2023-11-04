"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTokenWebsite = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const response_1 = __importDefault(require("../controllers/response"));
const createToken = (user) => {
    const accessToken = (0, jsonwebtoken_1.sign)({
        id: user.id,
        role: user.role,
    }, "SECRET");
    return accessToken;
};
exports.createToken = createToken;
const validateTokenWebsite = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
    // if token expired or not login
    if (!accessToken)
        return res.redirect("/login");
    try {
        (0, jsonwebtoken_1.verify)(accessToken, "SECRET", function (err, user) {
            if (err)
                return res.redirect("/login");
            req.user = user;
            next();
        });
    }
    catch (error) {
        return (0, response_1.default)(500, "server error", { error: error.message }, res);
    }
};
exports.validateTokenWebsite = validateTokenWebsite;
//# sourceMappingURL=JWT.js.map