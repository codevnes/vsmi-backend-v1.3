"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
require("./config/env.config");
const client_1 = require("@prisma/client");
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
// Initialize Express app
const app = (0, express_1.default)();
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files - Đơn giản hóa cấu hình để tránh xung đột đường dẫn
app.use('/images', express_1.default.static(path_1.default.join(process.cwd(), 'public/images')));
app.use('/processed', express_1.default.static(path_1.default.join(process.cwd(), 'public/images/processed')));
// CORS setup
app.use((req, res, next) => {
    // Cho phép cả localhost:5173 và localhost:3000
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
});
// Routes
app.use('/api', routes_1.default);
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: utils_1.AUTH_MESSAGES.SYSTEM_ERROR,
        error: err.message
    });
});
exports.default = app;
