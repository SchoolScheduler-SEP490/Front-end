import * as yup from 'yup';

export const timetableSchema = yup.object().shape({
	'': yup.string().required('Nhập địa email đăng nhập').email('Email không hợp lệ'),

	password: yup
		.string()
		.required('Nhập mật khẩu đăng nhập')
		.min(7, 'Mật khẩu phải có ít nhất 7 ký tự')
		.max(12, 'Mật khẩu không được quá 12 ký tự'),
});
