'use client';
import {
	IJWTTokenPayload,
	ILoginForm,
	ILoginResponse,
} from '@/app/(auth)/_utils/constants';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { IUser } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import { inter } from '@/utils/fonts';
import { IconButton, styled } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loginSchema } from '../libs/login_schema';

const CustomButton = styled(Button)({
	width: '100%',
	borderRadius: 0,
	boxShadow: 'none',
	padding: '10px 12px',
	backgroundColor: 'var(--primary-normal)',
	fontFamily: [inter].join(','),
});

export const LoginForm = () => {
	const { setSessionToken } = useAppContext();
	const router = useRouter();
	const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
	const [showPassword, setShowPassword] = useState(false);

	const handleRegister = () => {
		router.push('/register');
	};

	const handleForgotPassword = () => {
		router.push('/forgot-password');
	};

	const handleLogin = async ({ email, password }: ILoginForm) => {
		try {
			const result = await fetch(`${api}/api/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email.trim(), password: password.trim() }),
			}).then(async (response) => {
				const loginResponse: ILoginResponse = { ...(await response.json()) };
				let data: IUser | undefined = undefined;
				if (loginResponse.status === 200) {
					const decodedToken: IJWTTokenPayload = jwtDecode(
						loginResponse['jwt-token'] ?? ''
					);
					data = {
						email: decodedToken?.email ?? '',
						id: decodedToken?.accountId ?? '',
						role: decodedToken?.role ?? '',
						jwt: {
							token: loginResponse['jwt-token'] ?? '',
							refreshToken: loginResponse['jwt-refresh-token'] ?? '',
							expired: new Date(loginResponse.expired ?? ''),
						},
					};
				} else {
					useNotify({
						message: TRANSLATOR[loginResponse.message] ?? 'Đã có lỗi xảy ra',
						type: 'error',
						position: 'top-right',
						variant: 'light',
					});
				}
				return data;
			});
			const resultFromNextServer = await fetch('/api/auth', {
				method: 'POST',
				body: JSON.stringify(result),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(async (res) => {
				const payload = await res.json();
				const data = {
					status: res.status,
					payload,
				};
				if (!res.ok) {
					throw data;
				}
				return data;
			});
			setSessionToken(resultFromNextServer.payload.jwt.token);

			// This is applied when use in Production
			// window.location.reload();

			// This is applied when use in Development
			router.push('/timetable-management');
		} catch (error: any) {
			console.log('>>>ERROR: ', error);
		}
	};

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: loginSchema,
		onSubmit: async (formData) => {
			// await handleLogin(formData);
		},
	});

	return (
		<div className='w-full'>
			<form
				id='formId'
				onSubmit={(event: any) => {
					event.preventDefault();
					handleLogin({
						email: formik.values.email,
						password: formik.values.password,
					});
				}}
				className='flex flex-col justify-start items-center gap-3'
			>
				<TextField
					fullWidth
					variant='standard'
					id='email'
					name='email'
					label='Nhập địa chỉ email'
					value={formik.values.email}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.email && Boolean(formik.errors.email)}
					helperText={formik.touched.email && formik.errors.email}
					slotProps={{
						input: {
							endAdornment: (
								<Image
									className='opacity-30 mx-2 select-none'
									src='/images/icons/email.png'
									alt='email'
									width={20}
									height={20}
								/>
							),
						},
					}}
				/>
				<TextField
					fullWidth
					variant='standard'
					id='password'
					name='password'
					label='Nhập mật khẩu'
					type={showPassword ? 'text' : 'password'}
					value={formik.values.password}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.password && Boolean(formik.errors.password)}
					helperText={formik.touched.password && formik.errors.password}
					InputProps={{
						endAdornment: (
							<IconButton
								color='default'
								aria-label='Hiện mật khẩu'
								onClick={handleShowPassword}
							>
								<Image
									className='opacity-30'
									src={
										showPassword
											? '/images/icons/hidden.png'
											: '/images/icons/view.png'
									}
									alt='eye'
									width={20}
									height={20}
								/>
							</IconButton>
						),
					}}
				/>
				<h3
					className='text-body-small opacity-80 font-normal text-right w-full my-2 cursor-pointer'
					onClick={handleForgotPassword}
				>
					Quên mật khẩu?
				</h3>
				<CustomButton
					variant='contained'
					disableRipple
					type='submit'
					id='login-btn'
					className='mt-2'
				>
					<h4 className='text-body-large-strong font-medium tracking-widest'>
						ĐĂNG NHẬP
					</h4>
				</CustomButton>
				<h3 className='mt-12 text-body-medium font-normal text-gray-700'>
					Chưa có tài khoản?{' '}
					<span
						className='text-body-medium font-semibold text-tertiary-normal cursor-pointer'
						onClick={handleRegister}
					>
						Đăng ký
					</span>
				</h3>
			</form>
		</div>
	);
};
