'use client';
import { IJWTTokenPayload, ILoginForm, ILoginResponse } from '@/app/(auth)/_utils/constants';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import LoadingComponent from '@/commons/loading';
import { useAppContext } from '@/context/app_provider';
import useFetchSchoolYear from '@/hooks/useFetchSchoolYear';
import useNotify from '@/hooks/useNotify';
import { ISchoolYearResponse, IUser } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import { inter } from '@/utils/fonts';
import {
	Checkbox,
	FormControl,
	IconButton,
	InputLabel,
	ListItemText,
	MenuItem,
	Select,
	styled,
} from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loginSchema } from '../libs/login_schema';
import { setTeacherInfo } from '@/context/slice_teacher';
import { useTeacherDispatch } from '@/hooks/useReduxStore';

const ITEM_HEIGHT = 30;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			scrollbars: 'none',
		},
	},
};

const CustomButton = styled(Button)({
	width: '100%',
	borderRadius: 0,
	boxShadow: 'none',
	padding: '10px 12px',
	backgroundColor: 'var(--primary-normal)',
	fontFamily: [inter].join(','),
});

export const LoginForm = () => {
	const {
		setSessionToken,
		setRefreshToken,
		setUserRole,
		setSchoolId,
		setSchoolName,
		setSelectedSchoolYearId: setSchoolYear,
	} = useAppContext();
	const router = useRouter();
	const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';

	const [showPassword, setShowPassword] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const { data, mutate } = useFetchSchoolYear({ includePrivate: false });
	const [schoolYearIdOptions, setSchoolYearIdOptions] = useState<IDropdownOption<number>[]>([]);
	const [selectedSchoolYearId, setSelectedSchoolYearId] = useState<number>(0);
	const dispatch = useTeacherDispatch();

	useEffect(() => {
		mutate();
		if (data?.status === 200) {
			const options: IDropdownOption<number>[] = data.result.map((item: ISchoolYearResponse) => {
				const currentYear = new Date().getFullYear();
				if (
					parseInt(item['start-year']) <= currentYear &&
					parseInt(item['end-year']) >= currentYear
				) {
					setSelectedSchoolYearId(item.id);
				}
				return {
					label: `${item['start-year']} - ${item['end-year']}`,
					value: item.id,
				} as IDropdownOption<number>;
			});
			setSchoolYearIdOptions(options.sort((a, b) => a.label.localeCompare(b.label)));
		}
	}, [data]);

	const handleSelectSchoolYear = (value: string) => {
		setSelectedSchoolYearId(Number(value));
	};

	const handleRegister = () => {
		router.push('/register');
	};

	const handleForgotPassword = () => {
		router.push('/forgot-password');
	};

	const handleLogin = async ({ email, password }: ILoginForm) => {
		try {
			setIsLoggingIn(true);
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
					const decodedToken: IJWTTokenPayload = jwtDecode(loginResponse['jwt-token'] ?? '');

					if(decodedToken?.role === 'Teacher') {
						const teacherResponse = await fetch(
							`${api}/api/schools/${decodedToken.schoolId}/teachers/${decodedToken.email}/info`,
							{
							  headers: {
								Authorization: `Bearer ${loginResponse['jwt-token']}`,
							  },
							}
						  );
						  const teacherData = await teacherResponse.json();
						  if (teacherData.status === 200) {
							localStorage.setItem('teacherInfo', JSON.stringify(teacherData.result));
							dispatch(setTeacherInfo(teacherData.result));
						  }
					}
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
					setSchoolId(decodedToken?.schoolId ?? '');
					setSchoolName(decodedToken?.schoolName ?? '');
				} else {
					setIsLoggingIn(false);
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
				body: JSON.stringify({ ...result, selectedSchoolYearId }),
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
			setRefreshToken(resultFromNextServer.payload.jwt.refreshToken);
			setUserRole(resultFromNextServer.payload.role);
			setSchoolYear(resultFromNextServer.payload.selectedSchoolYearId);
			setIsLoggingIn(false);

			// Redirect to landing page of each role after login
			router.push('/');
		} catch (error: any) {
			console.log('>>>ERROR: ', error);
		}
	};

	useEffect(() => {
		if (isLoggingIn) {
			const timer = setTimeout(() => {
				setIsLoggingIn(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isLoggingIn]);

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
			<LoadingComponent loadingStatus={isLoggingIn} />
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
							<IconButton color='default' aria-label='Hiện mật khẩu' onClick={handleShowPassword}>
								<Image
									className='opacity-30'
									src={showPassword ? '/images/icons/hidden.png' : '/images/icons/view.png'}
									alt='eye'
									width={20}
									height={20}
								/>
							</IconButton>
						),
					}}
				/>
				<FormControl sx={{ width: '100%' }}>
					<InputLabel id='school-year-label' variant='standard'>
						Chọn năm học
					</InputLabel>
					<Select
						labelId='school-year-label'
						id='school-year'
						variant='standard'
						value={
							selectedSchoolYearId === 0
								? ''
								: schoolYearIdOptions.find((item) => item.value === selectedSchoolYearId)
						}
						onChange={(event: any) => handleSelectSchoolYear(event.target.value)}
						MenuProps={MenuProps}
						renderValue={(selected) => {
							return selected.label;
						}}
						sx={{ width: '100%', fontSize: '1.000rem' }}
					>
						{schoolYearIdOptions?.length === 0 && (
							<MenuItem disabled value={0}>
								Không tìm thấy năm học
							</MenuItem>
						)}
						{schoolYearIdOptions.map((item, index) => (
							<MenuItem key={item.label + index} value={item.value}>
								<Checkbox
									checked={selectedSchoolYearId === 0 ? false : selectedSchoolYearId === item.value}
								/>
								<ListItemText primary={item.label} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<h3
					className='text-body-small opacity-80 font-normal text-right w-full my-2 cursor-pointer'
					onClick={handleForgotPassword}
				>
					Quên mật khẩu?
				</h3>
				<CustomButton
					variant='contained'
					disableRipple
					disabled={!formik.isValid && selectedSchoolYearId !== 0}
					type='submit'
					id='login-btn'
					className='mt-2 dis'
				>
					<h4 className='text-body-large-strong font-medium tracking-widest'>ĐĂNG NHẬP</h4>
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
