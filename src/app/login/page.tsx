'use client';
import { LoginForm } from './_components/login_form';

const LoginPage = (): JSX.Element => {
	return (
		<div className='w-screen h-fit flex flex-col justify-start items-center mt-12 mb-3'>
			<h1 className='text-title-xl-strong uppercase font-semibold'>Đăng nhập</h1>
			<div className='login-container w-[25%] mt-4'>
				<LoginForm />
			</div>
		</div>
	);
};

export default LoginPage;
