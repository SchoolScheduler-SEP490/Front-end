export const TRANSLATOR: { [key: string]: string } = {
	// Login messages
	'Account not exist.': 'Sai tên tài khoản hoặc mật khẩu',
	'School manager has been verified!': 'Trường học đã được xác thực!',
	'Password incorrect.': 'Sai tên tài khoản hoặc mật khẩu',
	'Account can not access.': 'Tài khoản không thể truy cập',
	'Account not exist!': 'Sai tên tài khoản hoặc mật khẩu',

	// School messages
	'School Not found.': 'Không tìm thấy trường học',
	'School has been assigned to another account.': 'Trường học đã được gán cho tài khoản khác',
	'Create school manager successful.': 'Tạo mới trường học thành công',
	'Not found school manager!': 'Không tìm thấy người quản lý trường!',
	'Confirm create school manager account success':
		'Xác nhận tài khoản người quản lý trường học thành công',

	// Forgot password messages
	'Send otp reset password success.': 'Mã OTP đã được gửi vào email của bạn',
	'Send otp reset password failed.':
		'Mã OTP gửi không thành công, vui lòng kiểm tra lại thông tin',
	'OTP unvalid.': 'Mã OTP không hợp lệ',
	'Confirm otp reset password success. You can reset password now.': 'Xác nhận mã OTP thành công',

	// Reset password messages
	'Reset password success.': 'Đặt lại mật khẩu thành công',
	'Change password success.': 'Thay đổi mật khẩu thành công',
	'Your password invalid. Try again.': 'Mật khẩu của bạn không hợp lệ. Vui lòng thử lại',

	// Room messages
	'The room does not exist.': 'Không tìm thấy phòng',
	'The room name already exists.': 'Tên phòng đã tồn tại',
	'The room name is duplicated': 'Tên phòng bị trùng',
	'The room code already exists.': 'Mã phòng đã tồn tại',
	'The room code is duplicated': 'Mã phòng bị trùng',
	'Add room success.': 'Thêm phòng thành công',
	'Update room success.': 'Cập nhật phòng thành công',
	'Delete room success.': 'Xóa phòng thành công',
	'Get rooms success.': 'Lấy danh sách phòng thành công',

	// Building messages
	'The building does not exist.': 'Không tìm thấy tòa nhà',
	'The building name already exists.': 'Tên tòa nhà đã tồn tại',
	'The building name is duplicated': 'Tên tòa nhà bị trùng',
	'The building code does not exist.': 'Không tìm thấy mã tòa nhà',
	'The building code already exists.': 'Mã tòa nhà đã tồn tại',
	'The building code is duplicated': 'Mã tòa nhà bị trùng',
	'Add building success.': 'Thêm tòa nhà thành công',
	'Update building success.': 'Cập nhật tòa nhà thành công',
	'Delete building success.': 'Xóa tòa nhà thành công',
	'Get buildings success.': 'Lấy danh sách tòa nhà thành công',

	// Subject messages
	'Subject name already exists in school.': 'Tên môn học đã tồn tại trong trường',
	'Add subject success.': 'Thêm môn học thành công',
	'Subject not exist.': 'Không tìm thấy môn học',
	'Update subject successful': 'Cập nhật môn học thành công',
	'Get subject list successful': 'Lấy danh sách môn học thành công',
	'Get subject successful': 'Lấy thông tin môn học thành công',
	'Subject name already exist.': 'Tên môn học đã tồn tại',
	'Operation completed': 'Thêm môn học thành công',

	// Teacher messages
	'The teacher does not exist.': 'Không tìm thấy giáo viên',
	'The teacher email already exists.': 'Email giáo viên đã tồn tại',
	'Add teacher success.': 'Thêm giáo viên thành công',
	'Update teacher success.': 'Cập nhật giáo viên thành công',
	'Delete teacher success.': 'Xóa giáo viên thành công',
	'Get teachers success.': 'Lấy danh sách giáo viên thành công',
	'The teacher abbreviation does not exist.': 'Không tìm thấy mã viết tắt của giáo viên',

	// Grade messages
	'The grade does not exist.': 'Không tìm thấy khối lớp',
	'The grade code does not exist.': 'Không tìm thấy mã khối lớp',

	// Class messages
	'The class does not exist.': 'Không tìm thấy lớp',
	'The class name already exists.': 'Tên lớp đã tồn tại',
	'Add class success.': 'Thêm lớp thành công',
	'Update class success.': 'Cập nhật lớp thành công',
	'Delete class success.': 'Xóa lớp thành công',
	'Get classes success.': 'Lấy danh sách lớp thành công',
	'Homeroom teacher assign success': 'Gán giáo viên chủ nhiệm thành công',
	'Homeroom teacher was assigned to other class.': 'Giáo viên chủ nhiệm đã được gán cho lớp khác',
	'Each teacher can only assign to a class.': 'Mỗi giáo viên chỉ có thể gán cho một lớp',

	// Miscellaneous messages
	'Invalid Refresh token!': 'Refresh token không hợp lệ!',
	'Refresh token successful.': 'Làm mới token thành công',
	'Refresh token invalid or expired time': 'Refresh token không hợp lệ hoặc đã hết hạn',
	'Get account detail success.': 'Lấy thông tin tài khoản thành công',
	'Update account detail success.': 'Cập nhật thông tin tài khoản thành công',

	//Subject group messages
	'The school year does not exist.': 'Không tìm thấy năm học',
	'Add curriculum success.': 'Thêm Khung chương trình thành công',
	'Subject group type not exist.': 'Loại Khung chương trình môn không tồn tại',
	'Subject group name or code already exist.': 'Tên hoặc mã Khung chương trình môn đã tồn tại',
	'Update curriculum success.': 'Cập nhật Khung chương trình thành công',
	'Delete curriculum success.': 'Xóa Khung chương trình thành công',
	'Subject group not exist.': 'Không tìm thấy Khung chương trình',
	'Get curriculum list has no items': 'Chưa có môn học trong năm học được chọn',
	'Get curriculum list successful': 'Lấy danh sách Khung chương trình thành công',
	'Subject group has assign, can not update grade.':
		'Khung chương trình đã được gán, không thể cập nhật khối lớp',
	'Để tạo Khung chương trình môn cần chọn 4 môn tự chọn và 3 môn chuyên đề.':
		'Để tạo Khung chương trình môn cần chọn 4 môn tự chọn và 3 môn chuyên đề.',

	// Subject in group messages
	'Update subject in group success.': 'Cập nhật Tiết học thành công',
	'The curriculum assign success.': 'Áp dụng Khung chương trình thành công',

	// Teaching assignment messages
	'Add teaching assignment success.': 'Phân công giảng dạy thành công',

	// Department messages
	'Update department success.': 'Cập nhật tổ bộ môn thành công',
	'Delete department success.': 'Xóa tổ bộ môn thành công',
	'Add department success.': 'Thêm tổ bộ môn thành công',
	'Phân công tổ trưởng thành công!': 'Phân công tổ trưởng thành công',
	'Department name or code does existed.': 'Tên/Mã tổ bộ môn đã tồn tại',

	'Quick assign success!': 'Xếp tiết thành công',
};

export const STATUS_TRANSLATOR: { [key: string]: string } = {};
