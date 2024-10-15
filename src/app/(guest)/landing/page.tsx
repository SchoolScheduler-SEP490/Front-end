'use client';

import ContainedButton from '@/commons/button-contained';
import { IconButton, Radio, TextField } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
const LandingHero = dynamic(() => import('./_components/secion_hero'));
const LandingConstraints = dynamic(() => import('./_components/section_constraint'));
const LandingDescription = dynamic(() => import('./_components/section_description'));
const LandingPros = dynamic(() => import('./_components/section_pros'));
const LandingSchools = dynamic(() => import('./_components/section_schools'));
const LandingWCU = dynamic(() => import('./_components/section_wcu'));
import './_styles/landing_styles.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';

export default function Home(): JSX.Element {
	const [currentSection, setCurrentSection] = useState(1);
	const switchSection = (nextSection: number) => {
		setCurrentSection(nextSection); // Update to the new section
	};

	const handleGotoTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className='h-fit w-screen flex flex-col gap-5 pt-[5vh]'>
			{/* Banner section */}
			<section
				id='banner'
				className='w-screen h-[250px] flex flex-row justify-between items-center px-[8vw] overflow-visible'
			>
				<div
					id='slogan'
					className='w-1/2 h-full flex flex-col pt-4 justify-start items-center'
				>
					<h1 className='text-[2.8vw] animate-fade-up animate-once'>
						Thời gian hài hòa
					</h1>
					<h1 className='text-[3.2vw] font-bold text-primary-500 animate-fade-up animate-once animate-delay-500'>
						Tri thức vươn xa
					</h1>
				</div>
				<div
					id='scrollable'
					className='relative w-1/2 h-full flex flex-col gap-10 items-center justify-start overflow-visible'
				>
					<section
						className={`absolute inset-0 transition-all duration-500 ease-in-out transform 
							${
								currentSection === 1
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
					>
						<h3 className='text-title-small-strong mb-3 animate-fade-up animate-once'>
							Quản lý Thời khóa biểu
						</h3>
						<ul className='list-disc pl-4 text-body-large font-normal opacity-80 flex flex-col gap-2'>
							<li className='animate-fade-up animate-once animate-delay-500'>
								Khởi tạo TKB nhanh chóng.
							</li>
							<li className='animate-fade-up animate-once animate-delay-700'>
								Đồng bộ dữ liệu trên toàn hệ thống.
							</li>
							<li className='animate-fade-up animate-once animate-delay-1500'>
								Quản lý mọi nơi, dễ dàng, thuận tiện, nhanh gọn.
							</li>
							<li className='animate-fade-up animate-once animate-delay-1000'>
								Thông tin bảo mật đa lớp.
							</li>
						</ul>
						<Link
							href={'#'}
							className='w-[25%] min-w-[12vw] truncate !mt-3 flex justify-center gap-2 items-center border-b-2 border-primary-600 text-lg bg-gray-50 lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-primary-400 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-1 overflow-hidden group'
						>
							Khám phá
							<svg
								className='w-7 h-7 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full group-hover:border-none p-1 rotate-45'
								viewBox='0 0 16 19'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z'
									className='fill-gray-800 group-hover:fill-gray-800'
								></path>
							</svg>
						</Link>
					</section>
					<section
						className={`absolute inset-0 transition-all duration-500 ease-in-out transform 
							${
								currentSection === 2
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
					>
						<h3 className='text-title-small-strong mb-3'>Quản lý lớp học</h3>
						<ul className='list-disc pl-4 text-body-large font-normal opacity-80 flex flex-col gap-2'>
							<li>Quản lý các lớp học linh động.</li>
							<li>
								Đồng bộ dữ liệu học sinh nhanh chóng trên toàn hệ thống.
							</li>
							<li>Quản lý mọi nơi, dễ dàng, thuận tiện, nhanh gọn.</li>
							<li>Bảo mật thông tin.</li>
						</ul>
						<Link
							href={'#'}
							className='w-[25%] min-w-[12vw] truncate !mt-3 flex justify-center gap-2 items-center border-b-2 border-primary-600 text-lg bg-gray-50 lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-primary-400 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-1 overflow-hidden group'
						>
							Khám phá
							<svg
								className='w-7 h-7 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full group-hover:border-none p-1 rotate-45'
								viewBox='0 0 16 19'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z'
									className='fill-gray-800 group-hover:fill-gray-800'
								></path>
							</svg>
						</Link>
					</section>
					<section
						className={`absolute inset-0 transition-all duration-500 ease-in-out transform 
							${
								currentSection === 3
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
					>
						<h3 className='text-title-small-strong mb-3'>
							Quản lý giáo viên
						</h3>
						<ul className='list-disc pl-4 text-body-large font-normal opacity-80 flex flex-col gap-2'>
							<li>Tùy biến lịch dạy giáo viên linh hoạt.</li>
							<li>Tối ưu lịch dạy cho giáo viên trong cả tuần.</li>
							<li>Quản lý mọi nơi, dễ dàng, thuận tiện, nhanh gọn.</li>
							<li>Bảo mật thông tin.</li>
						</ul>
						<Link
							href={'#'}
							className='w-[25%] min-w-[12vw] truncate !mt-3 flex justify-center gap-2 items-center border-b-2 border-primary-600 text-lg bg-gray-50 lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-primary-400 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-1 overflow-hidden group'
						>
							Khám phá
							<svg
								className='w-7 h-7 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full group-hover:border-none p-1 rotate-45'
								viewBox='0 0 16 19'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z'
									className='fill-gray-800 group-hover:fill-gray-800'
								></path>
							</svg>
						</Link>
					</section>

					{/* Switch Section Buttons */}
					<div className='absolute right-0 flex flex-col items-center w-[20%] h-full py-[1%] overflow-visible'>
						{[1, 2, 3].map((item, index) => (
							<div
								key={'banner' + index}
								className='w-fit h-[50px] flex justify-center items-center'
							>
								<IconButton onClick={() => switchSection(item)}>
									<Radio
										sx={{
											'& .MuiSvgIcon-root': {
												fontSize:
													currentSection == item ? 35 : 20,
											},
										}}
										checked={currentSection == item}
									/>
								</IconButton>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Hero image */}
			<LandingHero />

			{/* Description section */}
			<LandingDescription />

			{/* Pros section */}
			<LandingPros />

			{/* Constraint section */}
			<LandingConstraints />

			{/* why-choose-us section */}
			<LandingWCU />

			{/* Schools section */}
			<LandingSchools />

			{/* Register section */}
			<section className='w-[80vw] h-fit max-h-[450px] bg-primary-400 mx-[10vw] mt-[3vh] flex flex-row justify-between items-center px-[4vw] py-[5vh]'>
				<div className='w-[50%] flex flex-col justify-start items-start gap-8'>
					<h1 className='text-title-xl text-white'>
						Quý thầy cô muốn sử dụng nền tảng của chúng tôi?
					</h1>
					<h4 className='text-white text-title-small font-light opacity-80'>
						Hãy đăng ký ngay để nhận những ưu đãi bất ngờ từ{' '}
						<strong className='font-semibold'>Schedulify</strong>
					</h4>
					<Link className='register-btn' href='/register'>
						<span className='top-key'></span>
						<span className='text'>ĐĂNG KÝ</span>
						<span className='bottom-key-1'></span>
						<span className='bottom-key-2'></span>
					</Link>
				</div>
				<Image
					className='w-[45%] h-full object-contain'
					src='/images/landing-decorator-3.png'
					alt='dec'
					width={350}
					height={300}
					loading='lazy'
				/>
			</section>

			<section className='w-screen h-fit flex justify-end items-baseline px-[10vw]'>
				<button className='btt-btn' onClick={handleGotoTop}>
					<div className='text'>
						<span>Về</span>
						<span>đầu</span>
						<span>trang</span>
					</div>
					<div className='clone'>
						<span>Về</span>
						<span>đầu</span>
						<span>trang</span>
					</div>
					<svg
						stroke-width='2'
						stroke='currentColor'
						viewBox='0 0 24 24'
						fill='none'
						className='h-6 w-6'
						xmlns='http://www.w3.org/2000/svg'
						width='20px'
					>
						<path
							d='M14 5l7 7m0 0l-7 7m7-7H3'
							stroke-linejoin='round'
							stroke-linecap='round'
						></path>
					</svg>
				</button>
			</section>

			{/* Contact infor section */}
			<section className='w-screen h-fit bg-primary-50 px-[10vw] py-[4vh] flex flex-row justify-between items-center'>
				<div className='w-1/3 h-full flex flex-col justify-between items-start'>
					<h1 className='text-title-medium-strong'>Đăng ký để nhận</h1>
					<h1 className='text-title-medium-strong'>Những thông tin mới nhất</h1>
				</div>
				<div className='w-full h-full flex flex-row justify-start items-center gap-2'>
					<TextField
						className='w-[100%]'
						label='Nhập email của thầy cô'
						variant='filled'
						color='success'
						sx={{ backgroundColor: 'white !important' }}
					/>
					<ContainedButton
						title='Đăng ký'
						disableRipple
						styles='w-[15%] py-[12px] bg-primary-400 text-white'
						textStyles='text-title-small font-normal tracking-wider normal-case'
					/>
				</div>
			</section>
		</div>
	);
}
