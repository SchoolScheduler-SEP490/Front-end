'use client';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import { loginSchema } from '../libs/login_schema';
import Image from 'next/image';
import { styled } from '@mui/material';

const CustomButton = styled(Button)({
	width: '100%',
	borderRadius: 0,
	boxShadow: 'none',
	letterSpacing: '0.05rem',
	textTransform: 'uppercase',
	fontSize: 'var(--font-size-18)',
	padding: '10px 12px',
	lineHeight: 1.5,
	backgroundColor: 'var(--primary-normal)',
	fontFamily: ['__Inter_36bd41', '__Inter_Fallback_36bd41'].join(','),
});

export const LoginForm = () => {
	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: loginSchema,
		onSubmit: (formData) => {
			signIn('credentials', { ...formData, redirect: false });
		},
	});

	const handleRegister = () => {};

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
				<h3 className='text-body-small text-right w-full my-2 cursor-pointer'>
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
