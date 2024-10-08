import * as yup from 'yup';

export const loginSchema = yup.object().shape({
	email: yup.string().required('Nhập địa email đăng nhập').email('Email không hợp lệ'),

	password: yup.string().required('Nhập mật khẩu đăng nhập'),
});
