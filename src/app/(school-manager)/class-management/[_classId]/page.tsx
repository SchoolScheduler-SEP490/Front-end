'use client';

import { useAppContext } from '@/context/app_provider';
import { useEffect, useState } from 'react';
import SMHeader from '@/commons/school_manager/header';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	Dialog,
	DialogContent,
	IconButton,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { IClassDetail, ISchoolYear, ISubjectAssignment } from '../_libs/constants';
import { CLASSGROUP_TRANSLATOR } from '@/utils/constants';
import { getTeacherAssignment } from '../_libs/apiClass';
import { useSelector } from 'react-redux';

export default function ClassDetails() {
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);

	const [classData, setClassData] = useState<IClassDetail>();
	const [schoolYear, setSchoolYear] = useState<ISchoolYear>();
	const [subjectAssignments, setSubjectAssignments] = useState<ISubjectAssignment[]>([]);
	const { sessionToken, selectedSchoolYearId, schoolId } = useAppContext();
	const api = process.env.NEXT_PUBLIC_API_URL;
	const searchParams = useSearchParams();
	const classId = searchParams.get('id');
	const router = useRouter();
	const [isModalOpen, setModalOpen] = useState(false);

	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			const classResponse = await fetch(
				`${api}/api/schools/${schoolId}/academic-years/${selectedSchoolYearId}/classes/${classId}`,
				{
					headers: {
						Authorization: `Bearer ${sessionToken}`,
					},
				}
			);
			const classData = await classResponse.json();

			if (classData.status === 200) {
				setClassData(classData.result);
				const schoolYearsResponse = await fetch(`${api}/api/academic-years`, {
					headers: {
						Authorization: `Bearer ${sessionToken}`,
					},
				});
				const schoolYearsData = await schoolYearsResponse.json();

				if (schoolYearsData.status === 200) {
					const matchingSchoolYear = schoolYearsData.result.find(
						(year: ISchoolYear) => year.id === classData.result['school-year-id']
					);
					if (matchingSchoolYear) {
						setSchoolYear(matchingSchoolYear);
					}
				}

				// Fetch teacher assignments
				const assignmentsData = await getTeacherAssignment(
					Number(classId),
					sessionToken,
					schoolId,
					selectedSchoolYearId
				);
				if (assignmentsData.status === 200) {
					setSubjectAssignments(assignmentsData.result);
				}
			}
		};

		if (sessionToken && classId) {
			fetchData();
		}
	}, [classId, sessionToken, api, schoolId, selectedSchoolYearId]);

	const handleBack = () => {
		router.push('/class-management');
	};

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
		>
			<SMHeader>
				<div className='flex items-center gap-4'>
					<IconButton onClick={handleBack} sx={{ color: 'white' }}>
						<ArrowBackIcon />
					</IconButton>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Thông tin lớp học
					</h3>
				</div>
			</SMHeader>

			<div className='w-full p-7'>
				{classData && (
					<div>
						<h2 className='text-title-medium font-semibold text-gray-800 border-b pb-2 mb-4 tracking-wider leading-loose cursor-pointer'>
							Thông tin chung
						</h2>

						<div className='grid grid-cols-2 gap-6 mb-8 leading-loose'>
							<div className='text-gray-700'>
								<p>
									<strong>Tên lớp:</strong> {classData.name}
								</p>
								<p>
									<strong>Khối:</strong> {CLASSGROUP_TRANSLATOR[classData.grade]}
								</p>
								<p>
									<strong>Số tiết học/tuần:</strong> {classData['period-count']}
								</p>
							</div>
							<div className='text-gray-700'>
								<p>
									<strong>GVCN:</strong> {classData['homeroom-teacher-name']}
								</p>
								<p>
									<strong>Mã GVCN:</strong> {classData['homeroom-teacher-abbreviation']}
								</p>
								<p>
									<strong>Ca học:</strong> {classData['main-session-text']}
								</p>
							</div>
						</div>

						<h2 className='text-title-medium font-semibold text-gray-800 border-b pb-2 mb-4 tracking-wider leading-loose cursor-pointer'>
							Thông tin học tập
						</h2>

						<div className='grid grid-cols-2 gap-6 mb-8 leading-loose'>
							<div className='text-gray-700'>
								<p>
									<strong>Khung chương trình:</strong> {classData['curriculum-name']}
								</p>
								<p>
									<strong>Học cả ngày:</strong> {classData['is-full-day'] ? 'Có' : 'Không'}
								</p>
								<p>
									<strong>Năm học:</strong>{' '}
									{schoolYear ? `${schoolYear['start-year']} - ${schoolYear['end-year']}` : ''}
								</p>
							</div>
							<div className='text-gray-700'>
								<p>
									<strong>Mã khung chương trình:</strong> {classData['curriculum-code']}
								</p>
								<p>
									<strong>Tên nhóm lớp:</strong> {classData['student-class-group-name']}
								</p>
								<p>
									<strong>Mã nhóm lớp:</strong> {classData['student-class-group-code']}
								</p>
							</div>
						</div>

						<Button
							variant='contained'
							color='inherit'
							sx={{ bgcolor: '#004e89', color: 'white', borderRadius: 0 }}
							onClick={handleOpenModal}
						>
							<Typography>Phân công giáo viên</Typography>
						</Button>

						<Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth='md' fullWidth>
							<div
								id='modal-header'
								className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3'
							>
								<Typography
									variant='h6'
									component='h2'
									className='text-title-medium-strong font-normal opacity-60'
								>
									Thông tin phân công chi tiết
								</Typography>
								<IconButton onClick={handleCloseModal}>
									<CloseIcon />
								</IconButton>
							</div>
							<DialogContent sx={{ p: 3 }}>
								<TableContainer
									component={Paper}
									sx={{
										width: '100%',
										maxHeight: 440,
										border: '1px solid rgba(224, 224, 224, 1)',
										boxShadow: 'none',
									}}
									className='overflow-y-scroll no-scrollbar'
								>
									<Table
										sx={{ minWidth: '100%' }}
										stickyHeader
										aria-label='teacher assignments table'
									>
										<TableHead
											sx={{
												'& .MuiTableCell-head': {
													fontWeight: 'bold',
													borderRight: '1px solid rgba(224, 224, 224, 1)',
												},
											}}
										>
											<TableRow
												sx={{
													whiteSpace: 'nowrap',
													cursor: 'pointer',
												}}
												hover
												role='checkbox'
												tabIndex={-1}
											>
												<TableCell>Môn học</TableCell>
												<TableCell>Giáo viên</TableCell>
												<TableCell>Học kì</TableCell>
												<TableCell>Số tiết</TableCell>
												<TableCell>Tuần bắt đầu</TableCell>
												<TableCell>Tuần kết thúc</TableCell>
												<TableCell>Tổng tiết/năm</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{subjectAssignments.map((subject) => {
												const teacherAssignments = subject['assignment-details'];
												let currentTeacher = '';
												let currentTeacherRowSpan = 0;

												return teacherAssignments.map((assignment, index) => {
													const teacherName = assignment['teacher-first-name'] === null || assignment['teacher-last-name'] === null
													? 'N/A'
													: `${assignment['teacher-first-name']} ${assignment['teacher-last-name']}`;
											
												let teacherCell = null;
												const rowId = `${subject['subject-id']}-${index}`;
											
												if (teacherName !== currentTeacher) {
													currentTeacher = teacherName;
													currentTeacherRowSpan = teacherAssignments.filter(
														(a) => {
															const name = a['teacher-first-name'] === null || a['teacher-last-name'] === null
																? 'N/A'
																: `${a['teacher-first-name']} ${a['teacher-last-name']}`;
															return name === teacherName;
														}
													).length;
													teacherCell = (
														<TableCell
															rowSpan={currentTeacherRowSpan}
															sx={{
																borderRight: '1px solid rgba(224, 224, 224, 1)',
															}}
														>
															{teacherName}
														</TableCell>
													);
												}

													return (
														<TableRow key={rowId}>
															{index === 0 && (
																<TableCell
																	rowSpan={teacherAssignments.length}
																	sx={{
																		borderRight: '1px solid rgba(224, 224, 224, 1)',
																	}}
																>
																	{subject['subject-name']}
																</TableCell>
															)}
															{teacherCell}
															<TableCell
																className='text-center'
																sx={{
																	borderRight: '1px solid rgba(224, 224, 224, 1)',
																}}
															>
																{assignment['term-name']}
															</TableCell>
															<TableCell
																className='text-center'
																sx={{
																	borderRight: '1px solid rgba(224, 224, 224, 1)',
																}}
															>
																{assignment['total-period']}
															</TableCell>
															<TableCell
																className='text-center'
																sx={{
																	borderRight: '1px solid rgba(224, 224, 224, 1)',
																}}
															>
																{assignment['start-week']}
															</TableCell>
															<TableCell
																className='text-center'
																sx={{
																	borderRight: '1px solid rgba(224, 224, 224, 1)',
																}}
															>
																{assignment['end-week']}
															</TableCell>
															{index === 0 && (
															<TableCell
																rowSpan={teacherAssignments.length}
																className='text-center'
																sx={{
																	borderRight: '1px solid rgba(224, 224, 224, 1)',
																}}
															>
																{subject['total-slot-in-year']}
															</TableCell>
														)}
														</TableRow>
													);
												});
											})}
										</TableBody>
									</Table>
								</TableContainer>
							</DialogContent>
						</Dialog>
					</div>
				)}
			</div>
		</div>
	);
}
