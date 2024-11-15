import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IDropdownOption } from '../../_utils/contants';
import useFetchTeacher from '../_hooks/useFetchTeacher';
import { IDepartmentResponse, ITeacherResponse } from '../_libs/constants';
import Image from 'next/image';

interface IDepartmentDetailsProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	isUpdateDepartmentOpen: boolean;
	setUpdateDepartmentOpen: Dispatch<SetStateAction<boolean>>;
	departmentData: IDepartmentResponse;
}

const DepartmentDetails = (props: IDepartmentDetailsProps) => {
	const { departmentData, open, setOpen, isUpdateDepartmentOpen, setUpdateDepartmentOpen } =
		props;
	const { schoolId, sessionToken } = useAppContext();

	const [existingTeachers, setExistingTeachers] = useState<IDropdownOption<number>[] | undefined>(
		undefined
	);
	const { data: teacherData, mutate: updateTeacher } = useFetchTeacher({
		schoolId: schoolId,
		sessionToken,
		pageIndex: 1,
		pageSize: 1000,
		departmentId: departmentData.id,
	});

	useEffect(() => {
		if (open && departmentData) {
			updateTeacher();
			if (teacherData?.status === 200) {
				var tmpTeachersArr: IDropdownOption<number>[] = teacherData.result.items.map(
					(teacher: ITeacherResponse) =>
						({
							value: teacher.id,
							label: `${teacher['first-name']} ${teacher['last-name']} (${teacher['abbreviation']})`,
						} as IDropdownOption<number>)
				);
				setExistingTeachers(useFilterArray(tmpTeachersArr, ['value']));
			}
		}
	}, [teacherData, open, departmentData]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleUpdateDepartment = () => {
		setUpdateDepartmentOpen(true);
	};

	return (
		<div
			className={`h-[100vh] w-[30%] flex flex-col justify-start items-center pb-[5vh] border-l-2 border-basic-gray-active overflow-y-scroll no-scrollbar ${
				open
					? 'visible animate-fade-left animate-once animate-duration-500 animate-ease-out'
					: 'hidden'
			}`}
		>
			<div className='w-full bg-white sticky top-0 left-0 pt-[2vh]'>
				<div className='w-full flex flex-row justify-between items-center pb-1 px-5 '>
					<div className='w-fit flex flex-row justify-start items-baseline gap-1'>
						<Typography
							variant='h6'
							className='text-title-small-strong font-normal w-full text-left'
						>
							Thông tin Tổ bộ môn
						</Typography>
						<Tooltip title='Chỉnh sửa thông tin bộ môn'>
							<IconButton
								onClick={handleUpdateDepartment}
								className='translate-y-[1px] opacity-80'
							>
								<Image
									src='/images/icons/compose.png'
									alt='Chỉnh sửa'
									width={17}
									height={17}
								/>
							</IconButton>
						</Tooltip>
					</div>
					<IconButton onClick={handleClose} className='translate-x-2'>
						<CloseIcon />
					</IconButton>
				</div>
				<Divider variant='fullWidth' orientation='horizontal' sx={{ width: '100%' }} />
			</div>
			<div className='w-full h-fit p-5 flex flex-col justify-start items-start gap-2'>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Tên tổ bộ môn</h4>
					{departmentData?.name ? (
						<h2 className='text-body-large-strong'>{departmentData?.name}</h2>
					) : (
						<Skeleton
							className='!text-body-large-strong'
							animation='wave'
							variant='text'
							sx={{ width: '50%' }}
						/>
					)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Mã tổ bộ môn</h4>
					{departmentData?.['department-code'] ? (
						<h2 className='text-body-large-strong'>
							{departmentData?.['department-code']}
						</h2>
					) : (
						<Skeleton
							className='!text-body-large-strong'
							animation='wave'
							variant='text'
							sx={{ width: '50%' }}
						/>
					)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Tổ trưởng</h4>
					{departmentData?.['teacher-department-head-id'] !== undefined ? (
						departmentData['teacher-department-head-id'] !== null ? (
							<h2 className='text-body-large-strong'>
								{`${departmentData['teacher-department-first-name']} ${departmentData['teacher-department-last-name']} (${departmentData['teacher-department-abbreviation']}) `}
							</h2>
						) : (
							<h2 className='text-body-small italic opacity-80'>
								Chưa phân công tổ trưởng
							</h2>
						)
					) : (
						<Skeleton
							className='!text-body-large-strong'
							animation='wave'
							variant='text'
							sx={{ width: '50%' }}
						/>
					)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Danh sách giáo viên</h4>
					{existingTeachers ? (
						<ul className='list-disc pl-6 w-full'>
							{existingTeachers.map(
								(teacher: IDropdownOption<number>, index: number) => (
									<li key={teacher.label + index}>{teacher.label}</li>
								)
							)}
						</ul>
					) : (
						<ul className='list-disc pl-6 w-full'>
							{[1, 2, 3, 4].map((item) => (
								<li key={item}>
									<Skeleton
										className='!text-body-large-strong'
										animation='wave'
										variant='text'
										sx={{ width: '80%' }}
									/>
								</li>
							))}
						</ul>
					)}
					{existingTeachers && existingTeachers.length === 0 && (
						<h2 className='text-body-small italic opacity-80'>
							Chưa có giáo viên trong tổ bộ môn
						</h2>
					)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Môn học</h4>
					{/* {existingTeachers ? (
						<ul className='list-disc pl-6 w-full'>
							{existingTeachers.map(
								(teacher: IDropdownOption<number>, index: number) => (
									<li key={teacher.label + index}>{teacher.label}</li>
								)
							)}
						</ul>
					) : (
						<ul className='list-disc pl-6 w-full'>
							{[1, 2, 3, 4].map((item) => (
								<li key={item}>
									<Skeleton
										className='!text-body-large-strong'
										animation='wave'
										variant='text'
										sx={{ width: '80%' }}
									/>
								</li>
							))}
						</ul>
					)} */}
					{/* {existingTeachers && existingTeachers.length === 0 && ( */}
					{true && (
						<h2 className='text-body-small italic opacity-80'>
							Môn học chưa được áp dụng cho tổ bộ môn
						</h2>
					)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Mô tả</h4>
					{departmentData?.description ? (
						<h2 className='text-body-large-strong'>{departmentData?.description}</h2>
					) : (
						<Skeleton
							className='!text-body-large-strong'
							animation='wave'
							variant='text'
							sx={{ width: '50%' }}
						/>
					)}
				</div>
				<Divider
					variant='middle'
					orientation='horizontal'
					sx={{ width: '90%', marginTop: '2vh' }}
				/>
			</div>
		</div>
	);
};

export default DepartmentDetails;
