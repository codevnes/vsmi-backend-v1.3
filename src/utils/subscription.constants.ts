export const SUBSCRIPTION_MESSAGES = {
  // Success messages
  GET_PLANS_SUCCESS: 'Danh sách gói cước được tải thành công',
  GET_PLAN_SUCCESS: 'Thông tin gói cước được tải thành công',
  CREATE_PLAN_SUCCESS: 'Gói cước đã được tạo thành công',
  UPDATE_PLAN_SUCCESS: 'Gói cước đã được cập nhật thành công',
  DELETE_PLAN_SUCCESS: 'Gói cước đã được xóa thành công',
  
  GET_SUBSCRIPTIONS_SUCCESS: 'Danh sách đăng ký gói cước được tải thành công',
  GET_SUBSCRIPTION_SUCCESS: 'Thông tin đăng ký gói cước được tải thành công',
  CREATE_SUBSCRIPTION_SUCCESS: 'Đăng ký gói cước đã được tạo thành công',
  UPDATE_SUBSCRIPTION_SUCCESS: 'Đăng ký gói cước đã được cập nhật thành công',
  CANCEL_SUBSCRIPTION_SUCCESS: 'Đăng ký gói cước đã được hủy thành công',
  
  // Error messages
  GET_PLANS_ERROR: 'Lỗi khi tải danh sách gói cước',
  GET_PLAN_ERROR: 'Lỗi khi tải thông tin gói cước',
  CREATE_PLAN_ERROR: 'Lỗi khi tạo gói cước',
  UPDATE_PLAN_ERROR: 'Lỗi khi cập nhật gói cước',
  DELETE_PLAN_ERROR: 'Lỗi khi xóa gói cước',
  
  GET_SUBSCRIPTIONS_ERROR: 'Lỗi khi tải danh sách đăng ký gói cước',
  GET_SUBSCRIPTION_ERROR: 'Lỗi khi tải thông tin đăng ký gói cước',
  CREATE_SUBSCRIPTION_ERROR: 'Lỗi khi tạo đăng ký gói cước',
  UPDATE_SUBSCRIPTION_ERROR: 'Lỗi khi cập nhật đăng ký gói cước',
  CANCEL_SUBSCRIPTION_ERROR: 'Lỗi khi hủy đăng ký gói cước',
  
  // Validation errors
  PLAN_NOT_FOUND: 'Không tìm thấy gói cước',
  SUBSCRIPTION_NOT_FOUND: 'Không tìm thấy đăng ký gói cước',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  INVALID_PLAN_DATA: 'Dữ liệu gói cước không hợp lệ',
  INVALID_SUBSCRIPTION_DATA: 'Dữ liệu đăng ký gói cước không hợp lệ',
  REQUIRED_PLAN_FIELDS: 'Các trường bắt buộc phải được cung cấp (name, price, durationDays)',
  REQUIRED_SUBSCRIPTION_FIELDS: 'Các trường bắt buộc phải được cung cấp (userId, planId)'
}; 