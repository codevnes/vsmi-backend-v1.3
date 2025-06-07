"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorOrAdmin = exports.isAdmin = exports.verifyToken = exports.checkRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const app_1 = require("../app");
const utils_1 = require("../utils");
const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: utils_1.AUTH_MESSAGES.TOKEN_REQUIRED });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.authConfig.jwtSecret);
            // Check if user exists
            const user = await app_1.prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                res.status(401).json({ message: utils_1.AUTH_MESSAGES.TOKEN_INVALID });
                return;
            }
            // Set user in request object
            req.user = {
                id: decoded.id,
                email: decoded.email,
                fullName: decoded.fullName,
                role: decoded.role
            };
            // Legacy support
            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        }
        catch (jwtError) {
            res.status(401).json({ message: utils_1.AUTH_MESSAGES.TOKEN_EXPIRED });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: utils_1.AUTH_MESSAGES.AUTH_ERROR });
        return;
    }
};
exports.authenticateToken = authenticateToken;
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: utils_1.AUTH_MESSAGES.FORBIDDEN });
            return;
        }
        next();
    };
};
exports.checkRole = checkRole;
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: utils_1.AUTH_MESSAGES.TOKEN_REQUIRED });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.authConfig.jwtSecret);
            // Check if user exists
            const user = await app_1.prisma.user.findUnique({
                where: { id: decoded.id },
            });
            if (!user) {
                res.status(401).json({ message: utils_1.AUTH_MESSAGES.TOKEN_INVALID });
                return;
            }
            // Set user ID and role in request object
            req.userId = decoded.id;
            req.userRole = decoded.role;
            next();
        }
        catch (jwtError) {
            res.status(401).json({ message: utils_1.AUTH_MESSAGES.TOKEN_EXPIRED });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: utils_1.AUTH_MESSAGES.AUTH_ERROR });
        return;
    }
};
exports.verifyToken = verifyToken;
const isAdmin = (req, res, next) => {
    if (req.userRole !== 'ADMIN') {
        res.status(403).json({ message: utils_1.AUTH_MESSAGES.FORBIDDEN });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
const isAuthorOrAdmin = (req, res, next) => {
    if (req.userRole !== 'ADMIN' && req.userRole !== 'AUTHOR') {
        res.status(403).json({ message: utils_1.AUTH_MESSAGES.FORBIDDEN });
        return;
    }
    next();
};
exports.isAuthorOrAdmin = isAuthorOrAdmin;
