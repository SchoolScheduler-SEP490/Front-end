'use client';

import ContainedButton from '@/commons/button-contained';
import { IconButton, Radio, Skeleton, TextField } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Home(): JSX.Element {
	const [currentSection, setCurrentSection] = useState(1);
	const [constraintSection, setConstraintSection] = useState(1);
	const [isLoading, setLoading] = useState(true);

	const switchSection = (nextSection: number) => {
		setCurrentSection(nextSection); // Update to the new section
	};

	const switchConstraintSection = (nextSection: number) => {
		setConstraintSection(nextSection); // Update to the new section
	};

	setTimeout(() => {
		setLoading(false);
	}, 500);

	return (
		<div className='h-fit w-screen flex flex-col gap-6 pt-[5vh]'>
			{/* Banner section */}
			<section
				id='banner'
				className='w-screen h-[200px] flex flex-row justify-between items-centers px-[8vw] overflow-visible'
			>
				<div
					id='slogan'
					className='w-1/2 flex flex-col justify-start pt-4 items-center'
				>
					<h1 className='text-[2.8vw]'>Thời gian hài hòa</h1>
					<h1 className='text-[3.2vw] font-bold text-primary-500'>
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
							${
								currentSection === 2
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
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
							${
								currentSection === 3
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
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
							styles='w-[150px] h-[35px] bg-primary-400 text-white mt-3'
							textStyles='text-title-small font-normal tracking-wider normal-case'
						/>
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
			<section>
				{isLoading ? (
					<Skeleton
						className='!w-screen h-[400px]'
						variant='rectangular'
						animation='wave'
						width={1000}
						height={400}
					/>
				) : (
					<Image
						className='w-screen h-[400px] object-cover object-center'
						src='/images/landing-banner.png'
						alt='hero'
						width={1000}
						height={400}
						loading='eager'
					/>
				)}
			</section>

			{/* Description section */}
			<section className='relative min-h-[500px] flex flex-row justify-end px-[10vw]'>
				<div className='w-fit h-fit bg-primary-400 absolute top-[5%] left-[10%] text-white px-[5vw] py-[5vh] flex flex-col justify-start items-end'>
					<h1 className='text-[2.2vw]'>Hệ thống sắp xếp</h1>
					<h1 className='text-[2.2vw]'>Thời khóa biểu tự động</h1>
				</div>
				<div className='overflow-hidden w-[200px] h-[250px] absolute bottom-0 left-[15%]'>
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
				<div className='overflow-hidden w-[300px] h-[350px] absolute bottom-[10%] left-[30%] z-[-1]'>
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
				<div className='w-[35vw] h-full min-h-[500px] pb-[5%] flex flex-col justify-between items-end gap-10'>
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
						<div className='w-fit h-fit flex flex-row justify-start gap-1 border-b-2 border-primary-500'>
							<Link
								href={'#'}
								className='text-body-xlarge font-semibold hover:text-primary-400 text-nowrap truncate'
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
			<section className='w-screen h-[45vh] bg-primary-50 px-[10vw] flex flex-row justify-between items-center'>
				<div className='w-[30%] flex flex-col justify-start items-start gap-2'>
					<div className='w-fit h-fit p-3 mb-3 bg-white rounded-[50%] border-1 border-secondary-darker'>
						<Image
							src={'/images/icons/book-stack.png'}
							alt='book-stack'
							width={30}
							height={30}
						/>
					</div>
					<h2 className='w-full text-left text-title-small-strong'>
						Tùy chỉnh chuyên sâu
					</h2>
					<p className='text-justify opacity-70'>
						Hỗ trợ đến hơn 30 ràng buộc của các đối tượng trong trường như
						giáo viên, phòng học, lớp học,...
					</p>
				</div>
				<div className='w-[30%] flex flex-col justify-start items-start gap-2'>
					<div className='w-fit h-fit p-3 mb-3 bg-white rounded-[50%] border-1 border-secondary-darker overflow-hidden'>
						<Image
							className='-translate-y-[2px]'
							src={'/images/icons/school-landing.png'}
							alt='book-stack'
							width={30}
							height={30}
						/>
					</div>
					<h2 className='w-full text-left text-title-small-strong'>
						Phản hồi nhanh chóng
					</h2>
					<p className='text-justify opacity-70'>
						Hệ thống tối ưu cùng những trải nghiệm mượt mà và thời gian xây
						dựng thời khỏa biểu được rút ngắn nhờ những thuật toán hiện đại.
					</p>
				</div>
				<div className='w-[30%] flex flex-col justify-start items-start gap-2'>
					<div className='w-fit h-fit p-3 mb-3 bg-white rounded-[50%] border-1 border-secondary-darker'>
						<Image
							className='translate-y-[2px]'
							src={'/images/icons/handshake.png'}
							alt='book-stack'
							width={30}
							height={30}
						/>
					</div>
					<h2 className='w-full text-left text-title-small-strong'>
						Giao diện thân thiện
					</h2>
					<p className='text-justify opacity-70'>
						Được thiết kế theo hướng hiện đại tối giản và phù hợp với nhiều
						nhóm người dùng khác nhau. Schedulify hứa hẹn sẽ mang đến trải
						nghiệm tốt nhất cho đối tác của mình.
					</p>
				</div>
			</section>

			{/* Constraint section */}
			<section className='relative w-screen h-fit min-h-[500px] my-[3vh] overflow-visible'>
				{/* Decorator */}
				<Image
					className='w-[10%] absolute bottom-0 left-0 h-fit object-contain'
					src='/images/landing-decorator-2.png'
					alt='dec'
					width={500}
					height={200}
					loading='lazy'
				/>

				{/* Section 1 - Teacher */}
				<section
					className={`absolute w-screen min-h-[500px] flex flex-row justify-end px-[10vw] inset-0 transition-all duration-500 ease-in-out transform 
							${
								constraintSection === 1
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
				>
					{/* Title */}
					<div className='absolute w-fit h-full top-0 left-[15%] flex flex-col justify-start items-end'>
						<h1 className='text-[2.3vw] w-full text-left'>Ràng buộc cho</h1>
						<h1 className='text-[2.3vw] font-semibold text-primary-600'>
							<span className='text-tertiary-normal'>Giáo viên</span> trong
							trường học{' '}
						</h1>
						<ul className='text-title-small-strong text-left flex flex-col gap-3 my-7'>
							<li>Thời gian nghỉ (bận) của giáo viên</li>
							<li>Số tiết chờ dạy (tiết trống) tối đa</li>
							<li>Số tiết nghỉ giữa hai buổi sáng chiều</li>
							<li>Số ngày dạy</li>
							<li className='text-center'>. . .</li>
						</ul>
						<div className='w-fit h-fit flex flex-row justify-start gap-1 border-b-2 border-primary-500'>
							<Link
								href={'#'}
								className='text-body-xlarge font-semibold hover:text-primary-400 text-nowrap truncate'
							>
								Xem tất cả
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

					{/* Image */}
					<div className='overflow-hidden w-[300px] h-[375px] absolute top-0 right-[25%] z-[-1]'>
						{isLoading ? (
							<Skeleton
								className='!w-full !h-full'
								variant='rectangular'
								animation='wave'
							/>
						) : (
							<Image
								className='w-full h-full object-cover object-right'
								src='/images/landing-teacher.png'
								alt='dec'
								width={800}
								height={600}
								loading='lazy'
							/>
						)}
					</div>

					{/* Description */}
					<div className='w-fit h-fit max-w-[20%] bg-primary-400 absolute bottom-0 right-[10%] text-white px-[3vw] py-[4vh] flex flex-col justify-start items-end'>
						<p className='text-body-large font-normal text-justify opacity-90'>
							Giáo viên là một trong những nhân tố quan trọng nhất ảnh hưởng
							đến chất lượng giảng dạy. Vậy nên chúng tôi đặc biệt quan tâm
						</p>
					</div>

					{/* Switch Section Buttons */}
				</section>

				{/* Section 2 - Subject */}
				<section
					className={`absolute w-screen min-h-[500px] flex flex-row justify-end px-[10vw] inset-0 transition-all duration-500 ease-in-out transform 
							${
								constraintSection === 2
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
				>
					{/* Title */}
					<div className='absolute w-fit h-full top-0 left-[15%] flex flex-col justify-start items-end'>
						<h1 className='text-[2.3vw] w-full text-left'>Ràng buộc cho</h1>
						<h1 className='text-[2.3vw] font-semibold text-primary-600'>
							<span className='text-tertiary-normal'>Môn học</span> trong
							trường học{' '}
						</h1>
						<ul className='text-title-small-strong text-left flex flex-col gap-3 my-7'>
							<li>Thời gian nghỉ (bận) của giáo viên</li>
							<li>Số tiết chờ dạy (tiết trống) tối đa</li>
							<li>Số tiết nghỉ giữa hai buổi sáng chiều</li>
							<li>Số ngày dạy</li>
							<li className='text-center'>. . .</li>
						</ul>
						<div className='w-fit h-fit flex flex-row justify-start gap-1 border-b-2 border-primary-500'>
							<Link
								href={'#'}
								className='text-body-xlarge font-semibold hover:text-primary-400 text-nowrap truncate'
							>
								Xem tất cả
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

					{/* Image */}
					<div className='overflow-hidden w-[300px] h-[375px] absolute top-0 right-[25%] z-[-1]'>
						{isLoading ? (
							<Skeleton
								className='!w-full !h-full'
								variant='rectangular'
								animation='wave'
							/>
						) : (
							<Image
								className='w-full h-full object-cover object-right'
								src='/images/landing-teacher.png'
								alt='dec'
								width={800}
								height={600}
								loading='lazy'
							/>
						)}
					</div>

					{/* Description */}
					<div className='w-fit h-fit max-w-[20%] bg-primary-400 absolute bottom-0 right-[10%] text-white px-[3vw] py-[4vh] flex flex-col justify-start items-end'>
						<p className='text-body-large font-normal text-justify opacity-90'>
							Giáo viên là một trong những nhân tố quan trọng nhất ảnh hưởng
							đến chất lượng giảng dạy. Vậy nên chúng tôi đặc biệt quan tâm
						</p>
					</div>

					{/* Switch Section Buttons */}
				</section>

				{/* Section 3 - Room */}
				<section
					className={`absolute w-screen min-h-[500px] flex flex-row justify-end px-[10vw] inset-0 transition-all duration-500 ease-in-out transform 
							${
								constraintSection === 3
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
				>
					{/* Title */}
					<div className='absolute w-fit h-full top-0 left-[15%] flex flex-col justify-start items-end'>
						<h1 className='text-[2.3vw] w-full text-left'>Ràng buộc cho</h1>
						<h1 className='text-[2.3vw] font-semibold text-primary-600'>
							<span className='text-tertiary-normal'>Phòng học</span> trong
							trường học{' '}
						</h1>
						<ul className='text-title-small-strong text-left flex flex-col gap-3 my-7'>
							<li>Thời gian nghỉ (bận) của giáo viên</li>
							<li>Số tiết chờ dạy (tiết trống) tối đa</li>
							<li>Số tiết nghỉ giữa hai buổi sáng chiều</li>
							<li>Số ngày dạy</li>
							<li className='text-center'>. . .</li>
						</ul>
						<div className='w-fit h-fit flex flex-row justify-start gap-1 border-b-2 border-primary-500'>
							<Link
								href={'#'}
								className='text-body-xlarge font-semibold hover:text-primary-400 text-nowrap truncate'
							>
								Xem tất cả
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

					{/* Image */}
					<div className='overflow-hidden w-[300px] h-[375px] absolute top-0 right-[25%] z-[-1]'>
						{isLoading ? (
							<Skeleton
								className='!w-full !h-full'
								variant='rectangular'
								animation='wave'
							/>
						) : (
							<Image
								className='w-full h-full object-cover object-right'
								src='/images/landing-teacher.png'
								alt='dec'
								width={800}
								height={600}
								loading='lazy'
							/>
						)}
					</div>

					{/* Description */}
					<div className='w-fit h-fit max-w-[20%] bg-primary-400 absolute bottom-0 right-[10%] text-white px-[3vw] py-[4vh] flex flex-col justify-start items-end'>
						<p className='text-body-large font-normal text-justify opacity-90'>
							Giáo viên là một trong những nhân tố quan trọng nhất ảnh hưởng
							đến chất lượng giảng dạy. Vậy nên chúng tôi đặc biệt quan tâm
						</p>
					</div>

					{/* Switch Section Buttons */}
				</section>

				{/* Section 4 - Curriculumn */}
				<section
					className={`absolute w-screen min-h-[500px] flex flex-row justify-end px-[10vw] inset-0 transition-all duration-500 ease-in-out transform 
							${
								constraintSection === 4
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
				>
					{/* Title */}
					<div className='absolute w-fit h-full top-0 left-[15%] flex flex-col justify-start items-end'>
						<h1 className='text-[2.3vw] w-full text-left'>Ràng buộc cho</h1>
						<h1 className='text-[2.3vw] font-semibold text-primary-600'>
							<span className='text-tertiary-normal'>
								Khung chương trình
							</span>{' '}
							BGD
						</h1>
						<ul className='text-title-small-strong text-left flex flex-col gap-3 my-7'>
							<li>Thời gian nghỉ (bận) của giáo viên</li>
							<li>Số tiết chờ dạy (tiết trống) tối đa</li>
							<li>Số tiết nghỉ giữa hai buổi sáng chiều</li>
							<li>Số ngày dạy</li>
							<li className='text-center'>. . .</li>
						</ul>
						<div className='w-fit h-fit flex flex-row justify-start gap-1 border-b-2 border-primary-500'>
							<Link
								href={'#'}
								className='text-body-xlarge font-semibold hover:text-primary-400 text-nowrap truncate'
							>
								Xem tất cả
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

					{/* Image */}
					<div className='overflow-hidden w-[300px] h-[375px] absolute top-0 right-[25%] z-[-1]'>
						{isLoading ? (
							<Skeleton
								className='!w-full !h-full'
								variant='rectangular'
								animation='wave'
							/>
						) : (
							<Image
								className='w-full h-full object-cover object-right'
								src='/images/landing-teacher.png'
								alt='dec'
								width={800}
								height={600}
								loading='lazy'
							/>
						)}
					</div>

					{/* Description */}
					<div className='w-fit h-fit max-w-[20%] bg-primary-400 absolute bottom-0 right-[10%] text-white px-[3vw] py-[4vh] flex flex-col justify-start items-end'>
						<p className='text-body-large font-normal text-justify opacity-90'>
							Giáo viên là một trong những nhân tố quan trọng nhất ảnh hưởng
							đến chất lượng giảng dạy. Vậy nên chúng tôi đặc biệt quan tâm
						</p>
					</div>

					{/* Switch Section Buttons */}
				</section>

				{/* Section 5 - Timetable */}
				<section
					className={`absolute w-screen min-h-[500px] flex flex-row justify-end px-[10vw] inset-0 transition-all duration-500 ease-in-out transform 
							${
								constraintSection === 5
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10 z-[-1]'
							}`}
				>
					{/* Title */}
					<div className='absolute w-fit h-full top-0 left-[15%] flex flex-col justify-start items-end'>
						<h1 className='text-[2.3vw] w-full text-left'>Ràng buộc cho</h1>
						<h1 className='text-[2.3vw] font-semibold text-primary-600'>
							<span className='text-tertiary-normal'>Thời khóa biểu</span>{' '}
							trường học{' '}
						</h1>
						<ul className='text-title-small-strong text-left flex flex-col gap-3 my-7'>
							<li>Thời gian nghỉ (bận) của giáo viên</li>
							<li>Số tiết chờ dạy (tiết trống) tối đa</li>
							<li>Số tiết nghỉ giữa hai buổi sáng chiều</li>
							<li>Số ngày dạy</li>
							<li className='text-center'>. . .</li>
						</ul>
						<div className='w-fit h-fit flex flex-row justify-start gap-1 border-b-2 border-primary-500'>
							<Link
								href={'#'}
								className='text-body-xlarge font-semibold hover:text-primary-400 text-nowrap truncate'
							>
								Xem tất cả
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

					{/* Image */}
					<div className='overflow-hidden w-[300px] h-[375px] absolute top-0 right-[25%] z-[-1]'>
						{isLoading ? (
							<Skeleton
								className='!w-full !h-full'
								variant='rectangular'
								animation='wave'
							/>
						) : (
							<Image
								className='w-full h-full object-cover object-right'
								src='/images/landing-teacher.png'
								alt='dec'
								width={800}
								height={600}
								loading='lazy'
							/>
						)}
					</div>

					{/* Description */}
					<div className='w-fit h-fit max-w-[20%] bg-primary-400 absolute bottom-0 right-[10%] text-white px-[3vw] py-[4vh] flex flex-col justify-start items-end'>
						<p className='text-body-large font-normal text-justify opacity-90'>
							Giáo viên là một trong những nhân tố quan trọng nhất ảnh hưởng
							đến chất lượng giảng dạy. Vậy nên chúng tôi đặc biệt quan tâm
						</p>
					</div>

					{/* Switch Section Buttons */}
				</section>

				{/* Section switcher */}
				<div className='absolute right-0 top-0 -translate-y-5 flex flex-col items-center w-[20%] h-full py-[1%] overflow-visible'>
					{[1, 2, 3, 4, 5].map((item, index) => (
						<div
							key={index}
							className='w-fit h-[30px] flex justify-center items-center'
						>
							<IconButton onClick={() => switchConstraintSection(item)}>
								<Radio
									sx={{
										'& .MuiSvgIcon-root': {
											fontSize: constraintSection == item ? 20 : 15,
										},
									}}
									checked={constraintSection == item}
								/>
							</IconButton>
						</div>
					))}
				</div>
			</section>

			{/* Schools section */}
			<section className='w-screen h-[420px] relative '>
				<Image
					className='w-[12%] absolute bottom-0 left-[2vw] object-contain'
					src='/images/landing-decorator-4.png'
					alt='dec'
					width={250}
					height={250}
					loading='lazy'
				/>
				<div className='mx-[10vw] h-full py-[3vh] flex flex-row justify-between items-center'>
					<div className='w-[30%] h-full py-[5vh] flex flex-col justify-start items-start'>
						<h4 className='text-title-small font-semibold opacity-70 mb-[5vh]'>
							Đối tác của chúng tôi
						</h4>
						<h1 className='text-title-1.5xl'>Những trường học</h1>
						<h1 className='text-title-1.5xl'>Đang sử dụng</h1>
					</div>
					<div className='w-[70%] h-full flex flex-row justify-start items-start'>
						<div className='w-[95%] h-full flex flex-row justify-start items-start gap-5'>
							<div className='w-[30%] h-full bg-primary-50'>
								{isLoading ? (
									<Skeleton
										className='!w-full h-[75%]'
										variant='rectangular'
										animation='wave'
										width={1000}
										height={400}
									/>
								) : (
									<Image
										className='w-full h-[75%] object-cover object-center'
										src='/images/school-example-1.jpg'
										alt='hero'
										width={1000}
										height={400}
										loading='eager'
									/>
								)}
								<div className='w-full h-[25%] px-[5%] flex flex-col justify-center'>
									<h4 className='text-body-medium-strong font-semibold opacity-80'>
										2020
									</h4>
									<h1 className='text-title-small-strong'>
										Trường THPT chuyên Hà Nội-Amsterdam
									</h1>
								</div>
							</div>
							<div className='w-[30%] h-full bg-primary-50'>
								{isLoading ? (
									<Skeleton
										className='!w-full h-[75%]'
										variant='rectangular'
										animation='wave'
										width={1000}
										height={400}
									/>
								) : (
									<Image
										className='w-full h-[75%] object-cover object-center'
										src='/images/school-example-2.webp'
										alt='hero'
										width={1000}
										height={400}
										loading='eager'
									/>
								)}
								<div className='w-full h-[25%] px-[5%] flex flex-col justify-center'>
									<h4 className='text-body-medium-strong font-semibold opacity-80'>
										2010
									</h4>
									<h1 className='text-title-small-strong'>
										Trường THPT Chuyên Lê Hồng Phong
									</h1>
								</div>
							</div>
							<div className='w-[30%] h-full bg-primary-50'>
								{isLoading ? (
									<Skeleton
										className='!w-full h-[75%]'
										variant='rectangular'
										animation='wave'
										width={1000}
										height={400}
									/>
								) : (
									<Image
										className='w-full h-[75%] object-cover object-center'
										src='/images/school-example-3.jpg'
										alt='hero'
										width={1000}
										height={400}
										loading='eager'
									/>
								)}
								<div className='w-full h-[25%] px-[5%] flex flex-col justify-center'>
									<h4 className='text-body-medium-strong font-semibold opacity-80'>
										2010
									</h4>
									<h1 className='text-title-small-strong'>
										Trường THPT Chuyên Nguyễn Du
									</h1>
								</div>
							</div>
						</div>
						<div className='w-[5%] h-full flex flex-col justify-between items-center'>
							<h3 className='text-vertical rotate-180 text-title-small'>
								TẤT CẢ ĐỐI TÁC CỦA CHÚNG TÔI
							</h3>
							<div className='w-fit h-fit overflow-visible rounded-[50%] border-1 border-primary-900'>
								<IconButton>
									<Image
										className='aspect-square object-contain'
										src={'/images/icons/right-up.png'}
										alt='arrow'
										width={15}
										height={15}
									/>
								</IconButton>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Register section */}
			<section className='w-[80vw] h-fit max-h-[400px] bg-primary-400 mx-[10vw] my-[3vh] flex flex-row justify-between items-center px-[5vw] py-[5vh]'>
				<div className='w-[50%] flex flex-col justify-start items-start gap-5'>
					<h1 className='text-title-xl text-white'>
						Quý thầy cô muốn sử dụng nền tảng của chúng tôi?
					</h1>
					<h4 className='text-white text-title-small font-light opacity-80'>
						Hãy đăng ký ngay để nhận những ưu đãi bất ngờ từ{' '}
						<strong className='font-semibold'>Schedulify</strong>
					</h4>
					<ContainedButton
						title='Đăng ký'
						disableRipple
						styles='w-[30%] py-[2px] bg-primary-50 text-primary-600'
						textStyles='text-title-small font-normal tracking-wider normal-case'
					/>
				</div>
				<Image
					className='w-[40%] h-full object-contain'
					src='/images/landing-decorator-3.png'
					alt='dec'
					width={300}
					height={250}
					loading='lazy'
				/>
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
