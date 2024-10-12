'use client';

import ContainedButton from '@/commons/button-contained';
import { IconButton, Radio, Skeleton, TextField } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ISchool } from '../_utils/constants';
import useCallAPI from './_hooks/useCallAPI';
import './_styles/landing_styles.css';

export default function Home(): JSX.Element {
	const { data, isLoading, error } = useCallAPI();
	const [schoolData, setSchoolData] = useState<ISchool[]>([]);
	const [currentSection, setCurrentSection] = useState(1);
	const [constraintSection, setConstraintSection] = useState(1);

	const switchSection = (nextSection: number) => {
		setCurrentSection(nextSection); // Update to the new section
	};

	const switchConstraintSection = (nextSection: number) => {
		setConstraintSection(nextSection); // Update to the new section
	};

	const handleGotoTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		setSchoolData(data?.result?.items);
	}, [data]);

	return (
		<div className='h-fit w-screen flex flex-col gap-6 pt-[5vh]'>
			{/* Banner section */}
			<section
				id='banner'
				className='w-screen h-[250px] flex flex-row justify-between items-center px-[8vw] overflow-visible'
			>
				<div
					id='slogan'
					className='w-1/2 h-full flex flex-col pt-4 justify-start items-center'
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
						<h3 className='text-title-small-strong mb-3'>
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
							styles='w-[150px] h-[35px] bg-primary-400 text-white mt-3'
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
						<h3 className='text-title-small-strong mb-3'>Quản lý lớp học</h3>
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
							styles='w-[150px] h-[35px] bg-primary-400 text-white mt-3'
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
						<h3 className='text-title-small-strong mb-3'>
							Quản lý giáo viên
						</h3>
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
						className='w-screen h-[500px] object-cover object-center'
						src='/images/landing-banner.png'
						alt='hero'
						unoptimized={true}
						width={1000}
						height={500}
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
							unoptimized={true}
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
							unoptimized={true}
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
						<Link
							href={'#'}
							className='flex justify-center gap-2 items-center border-b-2 border-primary-600 text-lg bg-gray-50 lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-primary-400 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-1 overflow-hidden group'
						>
							Tìm hiểu thêm
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
					</div>
				</div>
			</section>

			{/* Pros section */}
			<section className='w-screen h-[48vh] bg-primary-50 px-[10vw] pt-[5vh] flex flex-row justify-between items-center'>
				<div className='w-[20%] h-full flex flex-col justify-start items-start gap-2'>
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
				<div className='w-[20%] h-full flex flex-col justify-start items-start gap-2'>
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
				<div className='w-[20%] h-full flex flex-col justify-start items-start gap-2'>
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
				<div className='w-[20%] h-full flex flex-col justify-start items-start gap-2'>
					<div className='w-fit h-fit p-3 mb-3 bg-white rounded-[50%] border-1 border-secondary-darker'>
						<Image
							className='-translate-y-[2px]'
							src={'/images/icons/support.png'}
							alt='book-stack'
							width={30}
							height={30}
						/>
					</div>
					<h2 className='w-full text-left text-title-small-strong'>
						Hỗ trợ tích cực
					</h2>
					<p className='text-justify opacity-70'>
						Đội ngũ phát triển Schedulify luôn sẵn lòng hỗ trợ, giải đáp thắc
						mắc, tích cực ghi nhận góp ý từ người dùng và xử lý yêu cầu nhanh
						chóng.
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
								className='flex justify-center gap-2 items-center border-b-2 border-primary-600 text-lg bg-gray-50 lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-primary-400 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-1 overflow-hidden group'
							>
								Xem tất cả
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
								unoptimized={true}
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
								unoptimized={true}
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
											fontSize: constraintSection == item ? 25 : 15,
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
						<div className='w-[95%] h-full flex flex-row justify-start items-start gap-5 overflow-hidden'>
							{schoolData?.length ? (
								<>
									{schoolData.map((item, index) => (
										<div
											key={index}
											className='w-[30%] h-full bg-primary-50'
										>
											{isLoading ? (
												<Skeleton
													className='!w-full h-[60%]'
													variant='rectangular'
													animation='wave'
													width={1000}
													height={400}
												/>
											) : (
												<Image
													className='w-full h-[75%] object-cover object-center'
													src='/images/school-example-demo.jpg'
													alt='hero'
													width={1000}
													height={400}
													loading='eager'
												/>
											)}
											<div className='w-full h-[25%] px-[5%] flex flex-col justify-center'>
												<h4 className='text-body-medium-strong font-semibold opacity-80'>
													{`${new Date(
														item['update-date']
													).getFullYear()}`}
												</h4>
												<h1 className='text-title-small-strong'>
													{item.name}
												</h1>
											</div>
										</div>
									))}
								</>
							) : (
								<>
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
												unoptimized={true}
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
												unoptimized={true}
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
								</>
							)}
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
			<section className='w-[80vw] h-fit max-h-[400px] bg-primary-400 mx-[10vw] mt-[3vh] flex flex-row justify-between items-center px-[5vw] py-[5vh]'>
				<div className='w-[50%] flex flex-col justify-start items-start gap-5'>
					<h1 className='text-title-xl text-white'>
						Quý thầy cô muốn sử dụng nền tảng của chúng tôi?
					</h1>
					<h4 className='text-white text-title-small font-light opacity-80'>
						Hãy đăng ký ngay để nhận những ưu đãi bất ngờ từ{' '}
						<strong className='font-semibold'>Schedulify</strong>
					</h4>
					<a className='register-btn' href='#'>
						<span className='top-key'></span>
						<span className='text'>ĐĂNG KÝ</span>
						<span className='bottom-key-1'></span>
						<span className='bottom-key-2'></span>
					</a>
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
