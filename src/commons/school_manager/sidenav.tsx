'use client';

import {
	ISMNavigation,
	ISMSidenav,
	SM_SIDENAV,
} from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import Image from 'next/image';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../styles/sm_sidenav.css';

const SMSidenav = () => {
	const currentPath = usePathname();
	const router = useRouter();
	const [showDropdowns, setShowDropdowns] = useState<string[]>([]);
	const { sessionToken, setSessionToken, setRefreshToken, setUserRole, setSchoolId } =
		useAppContext();

	const handleLogout = async () => {
		await fetch('/api/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ sessionToken }),
		}).then(async (res) => {
			if (res.status === 200) {
				const data = await res.json();
				setSessionToken('');
				setRefreshToken('');
				setUserRole('');
				setSchoolId('');
				useNotify({
					message: data.message ?? 'Đã có lỗi xảy ra',
					type: 'error',
					position: 'top-right',
					variant: 'light',
				});
			}
			redirect('/landing');
		});
	};

	const handleNavigate = (url: string) => {
		// handle navigate
		router.push(url);
	};

	useEffect(() => {}, []);

	const toggleDropdown = (category: string) => {};

	return (
		<div className='relative w-[16%] h-screen flex flex-col justify-start items-start gap-5 bg-white border-r-1 border-gray-400'>
			<div className='absolute top-0 left-0 z-10 bg-white w-full min-h-[50px] flex justify-center items-center border-b-1 border-gray-400'>
				<Link
					href={'/'}
					className='w-fit h-full text-primary-500 text-title-xl-strong font-bold'
				>
					Schedulify
				</Link>
			</div>
			<div className='w-full h-fit py-[70px] flex flex-col justify-start items-center overflow-y-scroll no-scrollbar'>
				{SM_SIDENAV.map((category: ISMSidenav) => (
					<div
						key={`${category.category}-${Math.random}`}
						className='w-full flex flex-col justify-start items-center'
					>
						<div className='w-full h-fit pl-2 pr-5 py-2 flex flex-row justify-between items-center hover:bg-basic-gray-hover hover:cursor-pointer'>
							<h3 className='text-primary-400 text-title-small-strong'>
								{category.category}
							</h3>
							<Image
								className='opacity-30'
								src={'/images/icons/drop-arrow.png'}
								alt='drop-arrow'
								unoptimized={true}
								width={13}
								height={13}
							/>
						</div>
						{category.items.map((item: ISMNavigation) => (
							<div
								key={item.name}
								className={`w-[94%] h-fit flex flex-row justify-start items-center py-3 pl-5 pr-3 gap-5 mx[2%] rounded-[5px] hover:cursor-pointer 
									${currentPath === item.url ? 'bg-basic-gray-active ' : 'hover:bg-basic-gray-hover'}`}
								onClick={() => handleNavigate(item.url)}
							>
								<Image
									className='opacity-60'
									src={item.icon}
									alt='sidebar-icon'
									unoptimized={true}
									width={23}
									height={23}
								/>
								<p
									className={`text-body-medium font-normal ${
										currentPath === item.url ? ' !font-semibold' : ''
									}`}
								>
									{item.name}
								</p>
							</div>
						))}
					</div>
				))}
			</div>
			<div className='absolute bottom-0 right-0 w-full h-fit flex justify-center items-center bg-white py-3'>
				<button
					className='w-[60%] logout-btn text-center font-semibold text-body-medium'
					onClick={handleLogout}
				>
					ĐĂNG XUẤT
				</button>
			</div>
		</div>
	);
};

export default SMSidenav;
