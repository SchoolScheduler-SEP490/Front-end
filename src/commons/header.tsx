import Link from 'next/link';
import { useState } from 'react';

interface IHeaderList {
	name: string;
	url: string;
}

const headerList: IHeaderList[] = [
	{
		name: 'Trang chủ',
		url: '/',
	},
	{
		name: 'Thời khóa biểu',
		url: '/about',
	},
	{
		name: 'Quản lý trường học',
		url: '/about',
	},
	{
		name: 'Cộng đồng',
		url: '/about',
	},
	{
		name: 'Liên hệ',
		url: '/contact',
	},
];

const Header = () => {
	return (
		<nav className='flex justify-between items-center w-screen h-fit px-10 gap-8'>
			<div className='logo my-8 sm:my-2 md:my-4'>
				<Link href={headerList[0].url} className='w-fit'>
					<h2 className='text-primary-500 text-2xl font-bold w-fit tracking-wider'>
						Schedulify
					</h2>
				</Link>
			</div>

			<div className='flex justify-between items-center gap-12'>
				<div className='flex justify-end items-center gap-10 w-fit'>
					{headerList.map((item, index) => (
						<Link
							href={item.url}
							key={`${item.name}${index}`}
							className='py-1 h-9 hover:border-b-3 hover:border-primary-500'
						>
							<h3 className='font-medium tracking-wide'>{item.name}</h3>
						</Link>
					))}
				</div>

				<div className='login-btn w-28 py-1 px-2 border-b-3 border-primary-500'>
					<Link href='/login' title='Đăng nhập'>
						<h3 className='font-medium tracking-wide text-primary-dark hover:font-bold w-full text-center'>
							Đăng nhập
						</h3>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Header;
