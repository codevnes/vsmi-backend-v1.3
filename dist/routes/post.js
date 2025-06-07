"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController = __importStar(require("../controllers/post.controller"));
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/slug/:slug', postController.getPostBySlug);
// Protected routes - Yêu cầu đăng nhập
router.post('/', middlewares_1.verifyToken, middlewares_1.isAuthorOrAdmin, postController.createPost);
router.put('/:id', middlewares_1.verifyToken, middlewares_1.isAuthorOrAdmin, postController.updatePost);
router.delete('/:id', middlewares_1.verifyToken, middlewares_1.isAuthorOrAdmin, postController.softDeletePost);
// Admin routes - Yêu cầu quyền admin
router.put('/restore/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, postController.restorePost);
router.delete('/permanent/:id', middlewares_1.verifyToken, middlewares_1.isAdmin, postController.deletePost);
exports.default = router;
