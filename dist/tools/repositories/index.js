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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectedStocksRepository = exports.imageRepository = exports.postRepository = exports.categoryRepository = exports.userRepository = void 0;
var user_repository_1 = require("./user.repository");
var category_repository_1 = require("./category.repository");
var post_repository_1 = require("./post.repository");
var image_repository_1 = require("./image.repository");
var selectedStocks_repository_1 = require("./selectedStocks.repository");
// Export instances
var userRepository = new user_repository_1.UserRepository();
exports.userRepository = userRepository;
var categoryRepository = new category_repository_1.CategoryRepository();
exports.categoryRepository = categoryRepository;
var postRepository = new post_repository_1.PostRepository();
exports.postRepository = postRepository;
var imageRepository = new image_repository_1.ImageRepository();
exports.imageRepository = imageRepository;
var selectedStocksRepository = new selectedStocks_repository_1.SelectedStocksRepository();
exports.selectedStocksRepository = selectedStocksRepository;
// Export classes
__exportStar(require("./user.repository"), exports);
__exportStar(require("./category.repository"), exports);
__exportStar(require("./image.repository"), exports);
__exportStar(require("./post.repository"), exports);
__exportStar(require("./base.repository"), exports);
