import { INavList, NAV_LINKS } from '@/utils/constants';
import Link from 'next/link';

const Header = () => {
	const headerLinks: INavList[] = NAV_LINKS;

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
				<div className='flex justify-end items-center gap-10 w-fit'>
					{headerLinks.map((item, index) => (
						<Link
							href={item.url}
							key={`${item.name}${index}`}
							className='py-1 h-9 hover:border-b-3 hover:border-primary-500 opacity-80'
						>
							<h3 className='font-medium tracking-wide'>{item.name}</h3>
						</Link>
					))}
				</div>

				<div className='login-btn w-28 py-1 px-2 border-b-3 border-primary-600'>
					<Link href='/login' title='Đăng nhập'>
						<h3 className='font-medium tracking-wide text-primary-dark hover:font-semibold hover:text-primary-500 w-full text-center'>
							Đăng nhập
						</h3>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Header;
