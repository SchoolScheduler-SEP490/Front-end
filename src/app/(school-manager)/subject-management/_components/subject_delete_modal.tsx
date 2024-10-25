import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { ICommonResponse } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { KeyedMutator } from 'swr';

const style = {
	position: 'absolute',
	top: '40%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ISubjectDeleteModalProps {
	open: boolean;
	setOpen: (status: boolean) => void;
	subjectName: string;
	subjectId: number;
	mutate: KeyedMutator<any>;
}

const DeleteSubjectModal = (props: ISubjectDeleteModalProps) => {
	const { open, setOpen, subjectName, subjectId, mutate } = props;
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	const { sessionToken } = useAppContext();

	const handleClose = () => {
		setOpen(false);
	};

	const handleDeleteSubject = async () => {
		// Neeeds updating
		const response = await fetch(`${apiUrl}/api/subjects/${subjectId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data: ICommonResponse<any> = await response.json();
		if (data.status !== 200) {
			useNotify({
				message: TRANSLATOR[data.message ?? ''] ?? 'Có lỗi xảy ra',
				type: 'error',
			});
			return;
		} else {
			await mutate();
			useNotify({
				message: TRANSLATOR[data.message ?? ''] ?? 'Xóa môn học thành công',
				type: 'success',
			});
		}
		handleClose();
	};

	return (
		<Modal
			keepMounted
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center p-2 pl-5'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-large-strong font-semibold'
					>
						Xóa môn học
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='p-4 pl-5'>
					<Typography className='text-title-small-strong'>
						Bạn có chắc muốn xóa môn học <strong>{subjectName}</strong>?
					</Typography>
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Xóa môn học'
						disableRipple
						onClick={handleDeleteSubject}
						styles='bg-red-200 text-basic-negative text-normal !py-1 px-4'
					/>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active text-basic-gray !py-1 px-4'
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default DeleteSubjectModal;
