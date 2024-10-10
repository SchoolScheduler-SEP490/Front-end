'use client';
import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import Image from 'next/image';
import { loginSchema } from '../libs/login_schema';
import { useAppContext } from '@/context/app_provider';
import { IUser } from '@/utils/constants';
import {
	IJWTTokenPayload,
	ILoginResponse,
	ILoginForm,
} from '@/app/(auth)/_utils/constants';
import { jwtDecode } from 'jwt-decode';
import { inter } from '@/utils/fonts';
import { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';

const CustomButton = styled(Button)({
	width: '100%',
	borderRadius: 0,
	boxShadow: 'none',
	letterSpacing: '0.05rem',
	textTransform: 'uppercase',
	fontSize: 'var(--font-size-18)',
	padding: '10px 12px',
	lineHeight: 1.2,
	verticalAlign: 'center',
	backgroundColor: 'var(--primary-normal)',
	fontFamily: [inter].join(','),
});

export const LoginForm = () => {
	const { setSessionToken } = useAppContext();
	const router = useRouter();
	const [api, setApi] = useState<string>(process.env.NEXT_PUBLIC_API_URL || 'Unknown');

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
				body: JSON.stringify({ email: email, password: password }),
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
			router.refresh();
			setSessionToken(resultFromNextServer.payload.jwt.token);
		} catch (error: any) {
			console.log('>>>ERROR: ', error);
		}
	};

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: loginSchema,
		onSubmit: async (formData) => {
			await handleLogin(formData);
		},
	});

	return (
		<div className='w-full'>
			<form
				onSubmit={formik.handleSubmit}
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
									className='opacity-30'
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
					type='password'
					value={formik.values.password}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					error={formik.touched.password && Boolean(formik.errors.password)}
					helperText={formik.touched.password && formik.errors.password}
				/>
				<h3
					className='text-body-small text-right w-full my-2 cursor-pointer'
					onClick={handleForgotPassword}
				>
					Quên mật khẩu?
				</h3>
				<CustomButton
					variant='contained'
					disableRipple
					type='submit'
					className='mt-2'
				>
					ĐĂNG NHẬP
				</CustomButton>
				<h3 className='mt-12 text-body-medium'>
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
