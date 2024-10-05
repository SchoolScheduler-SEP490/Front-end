import Link from 'next/link';

const Footer = (): JSX.Element => {
	return (
		<nav className='w-screen h-fit px-24 pt-20 pb-5 bg-primary-800 text-white'>
			<div className='flex justify-between items-center'>
				<div className='flex-col justify-between items-center w-96 h-80'>
					{/* Logo container */}
					<div className='flex-col justify-between items-start h-full'>
						<Link href={'/'} className='w-fit'>
							<h2 className=' text-2xl font-semibold w-fit tracking-wider'>
								Schedulify
							</h2>
						</Link>
						<p className='text-justify w-full h-fit text-'>
							Đơn giản hóa quá trình tạo lập thời khóa biểu cho trường học
							cấp THPT toàn quốc
						</p>
					</div>
					{/* Decorator container */}
					<div className='decorator-container'></div>
				</div>
			</div>
		</nav>
	);
};

export default Footer;
