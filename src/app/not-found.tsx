'use client';
import { useRouter } from 'next/navigation';
import './_styles/notfound_style.css';

export default function NotFound() {
	const router = useRouter();
	return (
		<div id='notfound' className='w-screen h-screen flex justify-center items-center'>
			<div className='notfound'>
				<div className='notfound-404'>
					{/* <h3 className='text-red-600 !text-title-large !font-bold'>
						Không thể tìm thấy trang
					</h3> !*/}
					<h1 className='select-none'>
						<span className='!text-primary-400'>4</span>
						<span className='!text-primary-400'>0</span>
						<span className='!text-primary-400'>4</span>
					</h1>
				</div>
				<h2 className='!mt-3'>Chúng tôi không thể tìm thấy trang mà bạn yêu cầu</h2>
				<button
					className='bg-basic-gray-hover text-center w-[15vw] h-14 relative text-black text-xl font-semibold group'
					type='button'
					onClick={() => router.push('/')}
				>
					<div className='bg-tertiary-normal h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[14.5vw] z-10 duration-500'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 1024 1024'
							height='25px'
							width='25px'
						>
							<path d='M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z' fill='#000000'></path>
							<path
								d='m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z'
								fill='#000000'
							></path>
						</svg>
					</div>
					<p className='translate-x-5'>Về trang chủ</p>
				</button>
			</div>
		</div>
	);
}
