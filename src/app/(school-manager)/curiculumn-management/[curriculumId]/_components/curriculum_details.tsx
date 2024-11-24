import useFilterArray from '@/hooks/useFilterArray';
import { CLASSGROUP_STRING_TYPE, CLASSGROUP_TRANSLATOR } from '@/utils/constants';
import {
	Divider,
	IconButton,
	Paper,
	Skeleton,
	styled,
	Tooltip,
	tooltipClasses,
	TooltipProps,
	Typography,
} from '@mui/material';
import Image from 'next/image';
import { GroupedClasses, ICurriculumDetailResponse } from '../../_libs/constants';

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

interface ICurriculumDetailsProps {
	availableClasses: GroupedClasses | null;
	handleUpdateCurriculum: () => void;
	subjectGroupDetails: ICurriculumDetailResponse | null;
}

const CurriculumDetails = (props: ICurriculumDetailsProps) => {
	const { availableClasses, handleUpdateCurriculum, subjectGroupDetails } = props;

	return (
		<Paper sx={{ width: '80%', height: '90%', overflow: 'hidden', px: 2 }}>
			<div className='relative w-full h-[10%] flex flex-row justify-between items-center pb-1 px-5'>
				<div className='sticky top-0 left-0 w-full flex flex-row justify-between items-baseline py-[1vh]'>
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
								width={20}
								height={20}
							/>
						</IconButton>
					</LightTooltip>
				</div>
			</div>
			<Divider variant='fullWidth' orientation='horizontal' sx={{ width: '100%' }} />
			<div className='w-full h-[90%] p-5 flex flex-col justify-start items-start gap-2 overflow-y-scroll no-scrollbar'>
				<div className='w-full h-fit flex flex-row justify-between items-center'>
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
				<div className='w-full h-fit flex flex-row justify-start items-start'>
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
								{useFilterArray(
									subjectGroupDetails?.['subject-specializedt-views'],
									['subject-name']
								).map((item, index) => (
									<li className='w-full h-fit' key={item.abbreviation + index}>
										<div className='w-[90%] h-fit flex flex-row justify-between items-baseline'>
											<p className='max-w-[90%]'>{item['subject-name']}</p>
										</div>
									</li>
								))}
							</ul>
						) : (
							<ul className='list-disc pl-6 w-full'>
								{[1, 2, 3, 4, 5].map((item) => (
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
		</Paper>
	);
};

export default CurriculumDetails;
