import * as yup from 'yup';

export const registerSchema = yup.object().shape({
	province: yup.string().required('Vui lòng chọn tỉnh thành.'),

	school: yup.string().required('Vui lòng chọn trường.'),

    email: yup.string().required('Nhập địa chỉ email đăng nhập.').email('Email không hợp lệ.'),

    phone: yup.string().required('Nhập số điện thoại.'),

    password: yup.string().required('Nhập mặt khẩu.'),

    confirm: yup.string().required('Xác nhận mật khẩu.')
});