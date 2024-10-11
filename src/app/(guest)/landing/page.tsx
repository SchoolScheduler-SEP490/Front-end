'use client';

import ContainedButton from '@/commons/button-contained';
import { IconButton, Radio, Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Home(): JSX.Element {
	const [currentSection, setCurrentSection] = useState(1);
	const [isLoading, setLoading] = useState(true);

	const switchSection = (nextSection: number) => {
		setCurrentSection(nextSection); // Update to the new section
	};

	setTimeout(() => {
		setLoading(false);
	}, 500);

	return (
		<div className='h-fit w-screen flex flex-col gap-6 py-[5vh]'>
			{/* Banner section */}
			<section
				id='banner'
				className='w-screen h-[200px] flex flex-row justify-between items-centers px-[3vw]'
			>
				<div
					id='slogan'
					className='w-1/2 flex flex-col justify-start pt-4 items-center'
				>
					<h1 className='text-[3vw]'>Thời gian hài hòa</h1>
					<h1 className='text-[3.5vw] font-bold text-primary-500'>
						Tri thức vươn xa
					</h1>
				</div>
				<div
					id='scrollable'
					className='relative w-1/2 h-full flex flex-col gap-10 items-start justify-start overflow-hidden'
				>
					<section
						className={`absolute inset-0 transition-all duration-500 ease-in-out transform 
							${currentSection === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
					>
						<h3 className='text-title-small-strong'>
							Quản lý Thời khóa biểu
						</h3>
						<ul className='list-disc pl-4 text-body-large font-normal opacity-80 flex flex-col gap-2'>
							<li>Khởi tạo TKB nhanh chóng.</li>
							<li>Đồng bộ dữ liệu trên toàn hệ thống.</li>
							<li>Quản lý mọi nơi, dễ dàng, thuận tiện, nhanh gọn.</li>
							<li>Thông tin bảo mật đa lớp.</li>
						</ul>
						<ContainedButton
							title='Khám phá'
							disableRipple
							styles='w-[150px] h-[35px] bg-primary-400 text-white mt-1'
							textStyles='text-title-small font-normal tracking-wider normal-case'
						/>
					</section>
					<section
						className={`absolute inset-0 transition-all duration-500 ease-in-out transform 
							${currentSection === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
					>
						<h3 className='text-title-small-strong'>Quản lý lớp học</h3>
						<ul className='list-disc pl-4 text-body-large font-normal opacity-80 flex flex-col gap-2'>
							<li>Quản lý các lớp học linh động.</li>
							<li>
								Đồng bộ dữ liệu học sinh nhanh chóng trên toàn hệ thống.
							</li>
							<li>Quản lý mọi nơi, dễ dàng, thuận tiện, nhanh gọn.</li>
							<li>Bảo mật thông tin.</li>
						</ul>
						<ContainedButton
							title='Khám phá'
							disableRipple
							styles='w-[150px] h-[35px] bg-primary-400 text-white mt-1'
							textStyles='text-title-small font-normal tracking-wider normal-case'
						/>
					</section>
					<section
						className={`absolute inset-0 transition-all duration-500 ease-in-out transform 
							${currentSection === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
					>
						<h3 className='text-title-small-strong'>Quản lý giáo viên</h3>
						<ul className='list-disc pl-4 text-body-large font-normal opacity-80 flex flex-col gap-2'>
							<li>Tùy biến lịch dạy giáo viên linh hoạt.</li>
							<li>Tối ưu lịch dạy cho giáo viên trong cả tuần.</li>
							<li>Quản lý mọi nơi, dễ dàng, thuận tiện, nhanh gọn.</li>
							<li>Bảo mật thông tin.</li>
						</ul>
						<ContainedButton
							title='Khám phá'
							disableRipple
							styles='w-[150px] h-[35px] bg-primary-400 text-white mt-1'
							textStyles='text-title-small font-normal tracking-wider normal-case'
						/>
					</section>

					{/* Switch Section Buttons */}
					<div className='absolute right-0 flex flex-col items-center w-[20%] h-full py-[1%]'>
						<div className='w-fit h-[50px] flex justify-center items-center'>
							<IconButton onClick={() => switchSection(1)}>
								<Radio
									sx={{
										'& .MuiSvgIcon-root': {
											fontSize: currentSection == 1 ? 35 : 25,
										},
									}}
									checked={currentSection == 1}
								/>
							</IconButton>
						</div>
						<div className='w-fit h-[50px] flex justify-center items-center'>
							<IconButton onClick={() => switchSection(2)}>
								<Radio
									sx={{
										'& .MuiSvgIcon-root': {
											fontSize: currentSection == 2 ? 35 : 25,
										},
									}}
									checked={currentSection == 2}
								/>
							</IconButton>
						</div>
						<div className='w-fit h-[50px] flex justify-center items-center'>
							<IconButton onClick={() => switchSection(3)}>
								<Radio
									sx={{
										'& .MuiSvgIcon-root': {
											fontSize: currentSection == 3 ? 35 : 25,
										},
									}}
									checked={currentSection == 3}
								/>
							</IconButton>
						</div>
					</div>
				</div>
			</section>

			{/* Hero image */}
			<section>
				{isLoading ? (
					<Skeleton
						className='w-full h-[400px]'
						variant='rectangular'
						animation='wave'
						width={1000}
						height={400}
					/>
				) : (
					<Image
						className='w-screen h-[400px] object-cover object-center'
						src='/images/landing-banner.jpg'
						alt='hero'
						width={1000}
						height={400}
						loading='lazy'
					/>
				)}
			</section>

			{/* Description section */}
			<section className='relative min-h-[500px] flex flex-row justify-end px-[3vw]'>
				<div className='w-fit h-fit bg-primary-400 absolute top-0 left-[10%] text-white px-[5vw] py-[5vh] flex flex-col justify-start items-end'>
					<h1 className='text-title-1.5xl'>Hệ thống sắp xếp</h1>
					<h1 className='text-title-1.5xl'>Thời khóa biểu tự động</h1>
				</div>
				<div className='overflow-hidden w-[200px] h-[250px] absolute bottom-0 left-[18%]'>
					{isLoading ? (
						<Skeleton
							className='!w-full !h-full'
							variant='rectangular'
							animation='wave'
						/>
					) : (
						<Image
							className='w-full h-full object-right-top aspect-auto -scale-x-100'
							src='/images/landing-schedule-decorator1.jpg'
							alt='dec'
							width={1000}
							height={500}
							loading='lazy'
						/>
					)}
				</div>
				<div className='overflow-hidden w-[300px] h-[350px] absolute bottom-[10%] left-1/3 z-[-1]'>
					{isLoading ? (
						<Skeleton
							className='!w-full !h-full'
							variant='rectangular'
							animation='wave'
						/>
					) : (
						<Image
							className='w-full h-full object-none object-right-top'
							src='/images/landing-schedule-decorator2.png'
							alt='dec'
							width={500}
							height={600}
							loading='lazy'
						/>
					)}
				</div>
				<div className='w-1/3 h-full min-h-[500px] pb-[3%] flex flex-col justify-between items-end gap-10'>
					<Image
						className='w-[60%] h-fit object-contain'
						src='/images/landing-decorator-1.png'
						alt='dec'
						width={500}
						height={200}
						loading='lazy'
					/>
					<div className='w-full h-fit pr-[20%] flex flex-col justify-between items-start gap-4'>
						<p className='text-body-large font-normal text-justify opacity-80'>
							Với tôn chỉ{' '}
							<span className='font-semibold'>“làm mới để làm khác”</span>,
							Schedulify tự tin sẽ mang tới những trải nghiệm đặc tốt nhất
							và duy nhất dành cho những Trường học sử dụng hệ thống của
							chúng tôi.
						</p>
						<div className='w-[40%] h-fit flex flex-row justify-between gap-1 border-b-2 border-primary-500'>
							<Link
								href={'#'}
								className='text-body-xlarge font-semibold hover:text-primary-400'
							>
								Tìm hiểu thêm
							</Link>
							<Image
								className='aspect-square object-contain'
								src={'/images/icons/right-up.png'}
								alt='arrow'
								width={20}
								height={20}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Pros section */}
			<section></section>

			{/* Pros section */}
			<section></section>
		</div>
	);
}
