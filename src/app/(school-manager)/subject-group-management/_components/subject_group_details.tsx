import { useAppContext } from '@/context/app_provider';
import useFormatDate from '@/hooks/useFormatDate';
import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetchSGDetail from '../_hooks/useFetchSGDetail';
import { ISubjectGroupDetailResponse } from '../_libs/constants';
import { CLASSGROUP_STRING_TYPE } from '@/utils/constants';
import useFilterArray from '@/hooks/useFilterArray';

const GRADE_COLOR: { [key: number]: string } = {
	10: '#ff6b35',
	11: 'black',
	12: '#004e89',
};

interface ISubjectDetailsProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	subjectGroupId: number;
}

const SubjectGroupDetails = (props: ISubjectDetailsProps) => {
	const { open, setOpen, subjectGroupId } = props;
	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
	const [subjectGroupDetails, setSubjectDetails] = useState<ISubjectGroupDetailResponse | null>(
		null
	);
	const [convertedDateString, setConvertedDateString] = useState<string>('');
	const { data, mutate } = useFetchSGDetail({
		sessionToken,
		subjectGroupId,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
	});

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (data?.status === 200) {
		}
		{
			setSubjectDetails(data?.result);
			setConvertedDateString(useFormatDate(data?.result?.['create-date'] ?? ''));
		}
	}, [data]);

	useEffect(() => {
		mutate({ subjectGroupId });
	}, [subjectGroupId]);

	return (
		<div
			className={`h-full w-[30%] flex flex-col justify-start items-center pt-[2vh] pb-[5vh] border-l-2 border-basic-gray-active overflow-y-scroll no-scrollbar ${
				open
					? 'visible animate-fade-left animate-once animate-duration-500 animate-ease-out'
					: 'hidden'
			}`}
		>
			<div className='w-full flex flex-row justify-between items-center pb-1 px-5'>
				<Typography
					variant='h6'
					className='text-title-small-strong font-normal w-full text-left'
				>
					Thông tin Tổ hợp
				</Typography>
				<IconButton onClick={handleClose} className='translate-x-2'>
					<CloseIcon />
				</IconButton>
			</div>
			<Divider variant='fullWidth' orientation='horizontal' sx={{ width: '100%' }} />
			<div className='w-full h-fit p-5 flex flex-col justify-start items-start gap-2'>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Tên tổ hợp</h4>
					{subjectGroupDetails?.['group-name'] ? (
						<h2 className='text-body-large-strong'>
							{subjectGroupDetails?.['group-name']}
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
					<h4 className='text-body-small text-basic-gray'>Mã tổ hợp</h4>
					{subjectGroupDetails?.['group-code'] ? (
						<h2 className='text-body-large-strong'>
							{subjectGroupDetails?.['group-code']}
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
					<h4 className='text-body-small text-basic-gray'>Lớp áp dụng</h4>
					{subjectGroupDetails?.['student-class-views'] ? (
						<h2 className='text-body-large-strong'>
							{subjectGroupDetails?.['student-class-views']
								.map((item) => {
									return item['student-class-name'];
								})
								.join(' - ')}
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
					<h4 className='text-body-small text-basic-gray'>Môn tự chọn</h4>
					{subjectGroupDetails?.['subject-selective-views'] ? (
						<ul className='list-disc pl-6 w-full'>
							{useFilterArray(
								subjectGroupDetails?.['subject-selective-views'],
								'subject-name'
							).map((item, index) => (
								<li className='w-full h-fit' key={item.abbreviation + index}>
									<div className='w-[90%] h-fit flex flex-row justify-between items-baseline'>
										<p className='max-w-[90%]'>{item['subject-name']}</p>
										<p className='text-body-medium opacity-80'>
											{item['total-slot-in-year']}
										</p>
									</div>
								</li>
							))}
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
					{subjectGroupDetails?.['subject-selective-views'].length === 0 && (
						<h2 className='text-body-small italic opacity-80'>
							Tổ hợp chưa áp dụng môn tự chọn
						</h2>
					)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Môn bắt buộc</h4>
					{subjectGroupDetails?.['subject-required-views'] ? (
						<ul className='list-disc pl-6 w-full'>
							{useFilterArray(
								subjectGroupDetails?.['subject-required-views'],
								'subject-name'
							).map((item, index) => (
								<li className='w-full h-fit' key={item.abbreviation + index}>
									<div className='w-[90%] h-fit flex flex-row justify-between items-baseline'>
										<p className='max-w-[90%]'>{item['subject-name']}</p>
										<p className='text-body-medium opacity-80'>
											{item['total-slot-in-year']}
										</p>
									</div>
								</li>
							))}
						</ul>
					) : (
						<ul className='list-disc pl-6 w-full'>
							{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
					{subjectGroupDetails?.['subject-required-views'].length === 0 && (
						<h2 className='text-body-small italic opacity-80'>
							Tổ hợp chưa áp dụng môn bắt buộc
						</h2>
					)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Mô tả</h4>
					{subjectGroupDetails?.['group-description'] ? (
						<h2 className='text-body-large-strong'>
							{subjectGroupDetails?.['group-description']}
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
				<Divider
					variant='middle'
					orientation='horizontal'
					sx={{ width: '90%', marginTop: '2vh' }}
				/>
			</div>
		</div>
	);
};

export default SubjectGroupDetails;
