"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST_MESSAGES = exports.IMAGE_MESSAGES = exports.CATEGORY_MESSAGES = exports.USER_MESSAGES = exports.AUTH_MESSAGES = void 0;
// Auth message constants
exports.AUTH_MESSAGES = {
    REGISTRATION_SUCCESS: 'Đăng ký tài khoản thành công!',
    REGISTRATION_FAILED: 'Đăng ký thất bại. Vui lòng thử lại sau.',
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng thử lại sau.',
    INVALID_EMAIL: 'Email không hợp lệ.',
    INVALID_PASSWORD: 'Mật khẩu không đúng.',
    EMAIL_IN_USE: 'Email này đã được sử dụng. Vui lòng chọn email khác.',
    ACCOUNT_NOT_FOUND: 'Tài khoản không tồn tại.',
    REQUIRED_FIELDS: 'Vui lòng điền đầy đủ thông tin cần thiết.',
    LOGIN_REQUIRED_FIELDS: 'Vui lòng nhập email và mật khẩu.',
    WEAK_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự.',
    // Token related
    TOKEN_REQUIRED: 'Thiếu token xác thực.',
    TOKEN_INVALID: 'Token không hợp lệ hoặc người dùng không tồn tại.',
    TOKEN_EXPIRED: 'Token đã hết hạn hoặc không hợp lệ.',
    REFRESH_TOKEN_REQUIRED: 'Thiếu token làm mới.',
    REFRESH_TOKEN_INVALID: 'Token làm mới không hợp lệ hoặc đã hết hạn.',
    REFRESH_TOKEN_SUCCESS: 'Làm mới token thành công.',
    // User profile
    USER_NOT_FOUND: 'Không tìm thấy thông tin người dùng.',
    PROFILE_SUCCESS: 'Lấy thông tin người dùng thành công.',
    PROFILE_ERROR: 'Không thể lấy thông tin người dùng. Vui lòng thử lại sau.',
    UNAUTHORIZED: 'Bạn chưa đăng nhập.',
    FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
    // System
    SYSTEM_ERROR: 'Đã xảy ra lỗi! Vui lòng thử lại sau.',
    AUTH_ERROR: 'Đã xảy ra lỗi khi xác thực. Vui lòng thử lại sau.',
};
// User message constants
exports.USER_MESSAGES = {
    // User operations
    GET_USERS_SUCCESS: 'Lấy danh sách người dùng thành công.',
    GET_USER_SUCCESS: 'Lấy thông tin người dùng thành công.',
    CREATE_USER_SUCCESS: 'Tạo người dùng mới thành công.',
    UPDATE_USER_SUCCESS: 'Cập nhật thông tin người dùng thành công.',
    DELETE_USER_SUCCESS: 'Xóa người dùng thành công.',
    // User errors
    USER_NOT_FOUND: 'Không tìm thấy thông tin người dùng.',
    EMAIL_IN_USE: 'Email này đã được sử dụng. Vui lòng chọn email khác.',
    INVALID_USER_DATA: 'Thông tin người dùng không hợp lệ.',
    REQUIRED_FIELDS: 'Vui lòng điền đầy đủ thông tin cần thiết.',
    GET_USERS_ERROR: 'Không thể lấy danh sách người dùng. Vui lòng thử lại sau.',
    CREATE_USER_ERROR: 'Không thể tạo người dùng mới. Vui lòng thử lại sau.',
    UPDATE_USER_ERROR: 'Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau.',
    DELETE_USER_ERROR: 'Không thể xóa người dùng. Vui lòng thử lại sau.',
    // Permissions
    ADMIN_REQUIRED: 'Chỉ quản trị viên mới có quyền thực hiện thao tác này.',
    CANNOT_DELETE_SELF: 'Bạn không thể xóa tài khoản của chính mình.',
    // Pagination
    INVALID_PAGINATION: 'Tham số phân trang không hợp lệ.',
};
// Category message constants
exports.CATEGORY_MESSAGES = {
    // Category operations
    GET_CATEGORIES_SUCCESS: 'Lấy danh sách danh mục thành công.',
    GET_CATEGORY_SUCCESS: 'Lấy thông tin danh mục thành công.',
    CREATE_CATEGORY_SUCCESS: 'Tạo danh mục mới thành công.',
    UPDATE_CATEGORY_SUCCESS: 'Cập nhật thông tin danh mục thành công.',
    DELETE_CATEGORY_SUCCESS: 'Xóa danh mục thành công.',
    // Category errors
    CATEGORY_NOT_FOUND: 'Không tìm thấy thông tin danh mục.',
    CATEGORY_SLUG_EXISTS: 'Slug này đã được sử dụng. Vui lòng sử dụng tiêu đề khác.',
    INVALID_CATEGORY_DATA: 'Thông tin danh mục không hợp lệ.',
    REQUIRED_FIELDS: 'Vui lòng điền đầy đủ thông tin cần thiết.',
    GET_CATEGORIES_ERROR: 'Không thể lấy danh sách danh mục. Vui lòng thử lại sau.',
    CREATE_CATEGORY_ERROR: 'Không thể tạo danh mục mới. Vui lòng thử lại sau.',
    UPDATE_CATEGORY_ERROR: 'Không thể cập nhật thông tin danh mục. Vui lòng thử lại sau.',
    DELETE_CATEGORY_ERROR: 'Không thể xóa danh mục. Vui lòng thử lại sau.',
    // Parent category
    PARENT_CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục cha.',
    INVALID_PARENT_CATEGORY: 'Không thể đặt danh mục làm danh mục cha của chính nó.',
    CATEGORY_HAS_CHILDREN: 'Danh mục này chứa các danh mục con. Vui lòng xóa các danh mục con trước.',
    CATEGORY_HAS_POSTS: 'Danh mục này chứa bài viết. Vui lòng xóa hoặc di chuyển các bài viết trước.'
};
// Image message constants
exports.IMAGE_MESSAGES = {
    // Image operations
    GET_IMAGES_SUCCESS: 'Lấy danh sách hình ảnh thành công.',
    GET_IMAGE_SUCCESS: 'Lấy thông tin hình ảnh thành công.',
    UPLOAD_IMAGE_SUCCESS: 'Tải lên hình ảnh thành công.',
    UPDATE_IMAGE_SUCCESS: 'Cập nhật thông tin hình ảnh thành công.',
    DELETE_IMAGE_SUCCESS: 'Xóa hình ảnh thành công.',
    // Image errors
    IMAGE_NOT_FOUND: 'Không tìm thấy hình ảnh.',
    INVALID_IMAGE_DATA: 'Thông tin hình ảnh không hợp lệ.',
    GET_IMAGES_ERROR: 'Không thể lấy danh sách hình ảnh. Vui lòng thử lại sau.',
    UPLOAD_IMAGE_ERROR: 'Không thể tải lên hình ảnh. Vui lòng thử lại sau.',
    UPDATE_IMAGE_ERROR: 'Không thể cập nhật thông tin hình ảnh. Vui lòng thử lại sau.',
    DELETE_IMAGE_ERROR: 'Không thể xóa hình ảnh. Vui lòng thử lại sau.',
    // File validation
    FILE_REQUIRED: 'Vui lòng chọn một hình ảnh để tải lên.',
    INVALID_FILE_TYPE: 'Định dạng file không hợp lệ. Chỉ hỗ trợ các định dạng hình ảnh.',
    FILE_TOO_LARGE: 'Kích thước file quá lớn. Kích thước tối đa là 5MB.',
    // Image in use
    IMAGE_IN_USE: 'Hình ảnh đang được sử dụng. Không thể xóa.'
};
// Post message constants
exports.POST_MESSAGES = {
    // Post operations
    GET_POSTS_SUCCESS: 'Lấy danh sách bài viết thành công.',
    GET_POST_SUCCESS: 'Lấy thông tin bài viết thành công.',
    CREATE_POST_SUCCESS: 'Tạo bài viết mới thành công.',
    UPDATE_POST_SUCCESS: 'Cập nhật thông tin bài viết thành công.',
    DELETE_POST_SUCCESS: 'Xóa bài viết thành công.',
    // Post errors
    POST_NOT_FOUND: 'Không tìm thấy bài viết.',
    POST_SLUG_EXISTS: 'Slug này đã được sử dụng. Vui lòng sử dụng tiêu đề khác.',
    INVALID_POST_DATA: 'Thông tin bài viết không hợp lệ.',
    REQUIRED_FIELDS: 'Vui lòng điền đầy đủ thông tin cần thiết.',
    GET_POSTS_ERROR: 'Không thể lấy danh sách bài viết. Vui lòng thử lại sau.',
    CREATE_POST_ERROR: 'Không thể tạo bài viết mới. Vui lòng thử lại sau.',
    UPDATE_POST_ERROR: 'Không thể cập nhật thông tin bài viết. Vui lòng thử lại sau.',
    DELETE_POST_ERROR: 'Không thể xóa bài viết. Vui lòng thử lại sau.',
    // Related entities
    CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục.',
    STOCK_NOT_FOUND: 'Không tìm thấy mã cổ phiếu.',
    IMAGE_NOT_FOUND: 'Không tìm thấy hình ảnh.',
    // Permissions
    UNAUTHORIZED: 'Bạn không có quyền thực hiện thao tác này.',
    ACCESS_DENIED: 'Bạn không có quyền truy cập bài viết này.'
};
