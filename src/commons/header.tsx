'use client';
import { NAV_LINKS } from '@/app/(guest)/_utils/constants';
import { INavigation } from '@/utils/constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './styles/header.css';

const Header = () => {
	const headerLinks: INavigation[] = NAV_LINKS;
	const router = useRouter();
	const currentPath = usePathname();

	return (
		<nav className='flex justify-between items-center w-screen h-fit px-10 gap-8'>
			<div className='logo my-8 sm:my-2 md:my-4'>
				<Link href={headerLinks[0].url} className='w-fit'>
					<h2 className='text-primary-500 text-title-xl-strong font-bold w-fit'>
						Schedulify
					</h2>
				</Link>
			</div>

			<div className='flex justify-between items-center gap-12'>
				<div className='group flex justify-end items-center gap-10 w-fit'>
					{headerLinks.map((item, index) => (
						<Link
							href={item.url}
							key={`${item.name}${index}`}
							className='py-1 h-9 opacity-80'
						>
							<h3
								className={`text-title-small-strong tracking-wide ${
									currentPath === item.url
										? 'border-b-3 border-primary-600'
										: ''
								}`}
							>
								{item.name}
							</h3>
						</Link>
					))}
				</div>

				<button
					className='login-btn text-center font-semibold text-body-medium'
					onClick={() => router.push('/login')}
				>
					ĐĂNG NHẬP
				</button>
			</div>
		</nav>
	);
};

export default Header;
