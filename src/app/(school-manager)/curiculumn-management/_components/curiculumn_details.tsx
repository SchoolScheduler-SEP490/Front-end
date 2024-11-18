import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import CloseIcon from '@mui/icons-material/Close';
import {
	Divider,
	IconButton,
	Skeleton,
	styled,
	Tooltip,
	tooltipClasses,
	TooltipProps,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { GroupedClasses, ICurriculumDetailResponse } from '../_libs/constants';
import useGroupByGrade from '../_hooks/useGroupByGrade';
import useFetchCurriculumDetails from '../_hooks/useFetchCuriculumnDetail';
import { CLASSGROUP_STRING_TYPE, CLASSGROUP_TRANSLATOR } from '@/utils/constants';
import Image from 'next/image';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}));

const GRADE_COLOR: { [key: number]: string } = {
	10: '#ff6b35',
	11: 'black',
	12: '#004e89',
};

interface ISubjectDetailsProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	subjectGroupId: number;
	setIsUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CurriculumDetails = (props: ISubjectDetailsProps) => {
	const { open, setOpen, subjectGroupId, setIsUpdateModalOpen } = props;
	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
	const [subjectGroupDetails, setSubjectDetails] = useState<ICurriculumDetailResponse | null>(
		null
	);
	const [availableClasses, setAvailableClasses] = useState<GroupedClasses | null>(null);
	const { data, mutate } = useFetchCurriculumDetails({
		sessionToken,
		subjectGroupId,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
	});

	const handleClose = () => {
		setOpen(false);
	};

	const handleUpdateCurriculum = () => {
		setIsUpdateModalOpen(true);
	};

	useEffect(() => {
		if (data?.status === 200) {
			setSubjectDetails(data?.result);
			setAvailableClasses(useGroupByGrade(data?.result?.['student-class-views'] ?? []));
		}
	}, [data]);

	useEffect(() => {
		mutate({ subjectGroupId });
	}, [subjectGroupId]);

	return (
		<div
			className={`h-full  flex flex-col justify-start items-center pt-[2vh] pb-[5vh] border-l-2 border-basic-gray-active overflow-y-scroll no-scrollbar transition-all duration-300 ease-in-out transform
    ${open ? ' w-[35%] translate-x-0 opacity-100' : ' w-0 translate-x-full opacity-0'}`}
		>
			<div className='w-full flex flex-row justify-between items-center pb-1 px-5'>
				<div className='w-fit flex flex-row justify-start items-baseline gap-1'>
					<LightTooltip title='Thông tin Khung chương trình' placement='bottom' arrow>
						<Typography
							variant='h6'
							className='text-title-small-strong font-normal w-full text-left text-ellipsis text-nowrap overflow-hidden'
							sx={{}}
						>
							Thông tin Khung chương trình
						</Typography>
					</LightTooltip>
					<LightTooltip title='Chỉnh sửa thông tin bộ môn'>
						<IconButton
							onClick={handleUpdateCurriculum}
							className='translate-y-[1px] opacity-80'
						>
							<Image
								src='/images/icons/compose.png'
								alt='Chỉnh sửa'
								unoptimized={true}
								width={17}
								height={17}
							/>
						</IconButton>
					</LightTooltip>
				</div>
				<IconButton onClick={handleClose} className='translate-x-2'>
					<CloseIcon />
				</IconButton>
			</div>
			<Divider variant='fullWidth' orientation='horizontal' sx={{ width: '100%' }} />
			<div className='w-full h-fit p-5 flex flex-col justify-start items-start gap-2'>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Tên Khung chương trình</h4>
					{subjectGroupDetails?.['curriculum-name'] ? (
						<h2 className='text-body-large-strong'>
							{subjectGroupDetails?.['curriculum-name']}
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
					<h4 className='text-body-small text-basic-gray'>Khối áp dụng</h4>
					{subjectGroupDetails?.grade ? (
						<h2
							className='text-body-large-strong'
							style={{
								color: GRADE_COLOR[
									CLASSGROUP_TRANSLATOR[subjectGroupDetails?.grade]
								],
							}}
						>
							{
								CLASSGROUP_STRING_TYPE.find(
									(item) =>
										item.value ===
										CLASSGROUP_TRANSLATOR[subjectGroupDetails?.grade]
								)?.key
							}
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
					{availableClasses ? (
						<ul className='list-disc pl-6 w-full'>
							{Object.entries(availableClasses).map(([grade, classNames]) => (
								<li key={grade}>
									<div className='flex flex-row justify-start items-baseline gap-2'>
										<h2 className='text-body-large font-medium min-w-[23%]'>
											Khối {grade}:
										</h2>
										<h2 className='text-body-medium opacity-80'>
											{(classNames as string[]).join(' - ')}
										</h2>
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
					{availableClasses && Object.keys(availableClasses).length === 0 && (
						<h2 className='text-body-small italic opacity-80'>
							Chưa có lớp áp dụng Khung chương trình
						</h2>
					)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Môn tự chọn</h4>
					{subjectGroupDetails?.['subject-selective-views'] ? (
						<ul className='list-disc pl-6 w-full'>
							{useFilterArray(subjectGroupDetails?.['subject-selective-views'], [
								'subject-name',
							]).map((item, index) => (
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
					{subjectGroupDetails?.['subject-selective-views'] &&
						subjectGroupDetails?.['subject-selective-views'].length === 0 && (
							<h2 className='text-body-small italic opacity-80'>
								Khung chương trình chưa áp dụng môn tự chọn
							</h2>
						)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Môn chuyên đề</h4>
					{subjectGroupDetails?.['subject-specializedt-views'] ? (
						<ul className='list-disc pl-6 w-full'>
							{useFilterArray(subjectGroupDetails?.['subject-specializedt-views'], [
								'subject-name',
							]).map((item, index) => (
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
					{subjectGroupDetails?.['subject-specializedt-views'] &&
						subjectGroupDetails?.['subject-specializedt-views'].length === 0 && (
							<h2 className='text-body-small italic opacity-80'>
								Khung chương trình chưa áp dụng môn chuyên đề
							</h2>
						)}
				</div>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Môn bắt buộc</h4>
					{subjectGroupDetails?.['subject-required-views'] ? (
						<ul className='list-disc pl-6 w-full'>
							{useFilterArray(subjectGroupDetails?.['subject-required-views'], [
								'subject-name',
							]).map((item, index) => (
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
					{subjectGroupDetails?.['subject-required-views'] &&
						subjectGroupDetails?.['subject-required-views'].length === 0 && (
							<h2 className='text-body-small italic opacity-80'>
								Khung chương trình chưa áp dụng môn chuyên đề
							</h2>
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

export default CurriculumDetails;
