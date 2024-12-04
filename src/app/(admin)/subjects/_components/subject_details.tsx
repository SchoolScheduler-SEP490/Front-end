import { useAppContext } from '@/context/app_provider';
import useFormatDate from '@/hooks/useFormatDate';
import CloseIcon from '@mui/icons-material/Close';
import { Divider, IconButton, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetchSubjectDetails from '../_hooks/useFetchSubjectDetails';
import { ISubject } from '../_libs/constants';

interface ISubjectDetailsProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	subjectId: number;
}

const SubjectDetails = (props: ISubjectDetailsProps) => {
	const { open, setOpen, subjectId } = props;
	const { sessionToken } = useAppContext();
	const [subjectDetails, setSubjectDetails] = useState<ISubject | null>(null);
	const [convertedDateString, setConvertedDateString] = useState<string>('');
	const { data, error, isValidating, mutate } = useFetchSubjectDetails({
		sessionToken,
		subjectId,
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
		mutate({ subjectId });
	}, [subjectId]);

	return (
		<div
			className={`h-full flex flex-col justify-start items-center pt-[2vh] border-l-2 border-basic-gray-active overflow-y-scroll no-scrollbar transition-all duration-300 ease-in-out transform ${
				open ? ' w-[30%] translate-x-0 opacity-100' : ' w-0 translate-x-full opacity-0'
			}`}
		>
			<div className='w-full flex flex-row justify-between items-center pb-1 px-5'>
				<Typography variant='h6' className='text-title-small-strong font-normal w-full text-left'>
					Thông tin môn học
				</Typography>
				<IconButton onClick={handleClose} className='translate-x-2'>
					<CloseIcon />
				</IconButton>
			</div>
			<Divider variant='middle' orientation='horizontal' sx={{ width: '100%' }} />
			<div className='w-full h-fit p-5 flex flex-col justify-start items-start gap-3'>
				<div className='w-full flex flex-col justify-start items-start'>
					<h4 className='text-body-small text-basic-gray'>Tên môn học</h4>
					{subjectDetails?.['subject-name'] ? (
						<h2 className='text-body-large-strong'>{subjectDetails?.['subject-name']}</h2>
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
					<h4 className='text-body-small text-basic-gray'>Mã môn</h4>
					{subjectDetails?.abbreviation ? (
						<h2 className='text-body-large-strong'>{subjectDetails?.abbreviation}</h2>
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
					<h4 className='text-body-small text-basic-gray'>Tổ bộ môn</h4>
					{subjectDetails?.['subject-group-type'] ? (
						<h2 className='text-body-large-strong'>{subjectDetails?.['subject-group-type']}</h2>
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
					<h4 className='text-body-small text-basic-gray'>Loại môn học</h4>
					{subjectDetails?.['is-required'] !== undefined ? (
						<h2
							className={`text-body-large-strong ${
								subjectDetails?.['is-required'] ? 'text-tertiary-normal' : 'text-primary-500'
							}`}
						>
							{subjectDetails?.['is-required'] ? 'Bắt buộc' : 'Tự chọn'}
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
					<h4 className='text-body-small text-basic-gray'>Ngày tạo</h4>
					{subjectDetails?.['create-date'] ? (
						<h2 className='text-body-large-strong'>{convertedDateString}</h2>
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

export default SubjectDetails;
