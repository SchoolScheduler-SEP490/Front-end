import { Box, IconButton, Modal, Typography } from '@mui/material';
import { ISubjectTableData } from '../../_utils/contants';
import CloseIcon from '@mui/icons-material/Close';
import ContainedButton from '@/commons/button-contained';
import useNotify from '@/hooks/useNotify';

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
	setSubjectTableData?: (data: ISubjectTableData[]) => void;
}

const DeleteSubjectModal = (props: ISubjectDeleteModalProps) => {
	const { open, setOpen, subjectName, setSubjectTableData } = props;

	const handleClose = () => {
		setOpen(false);
	};

	const handleDeleteSubject = () => {
		// Neeeds updating
		useNotify({
			message: 'Xóa môn học thành công',
			type: 'success',
		});
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
					className='w-full h-fit flex flex-row justify-between items-center bg-basic-negative-hover p-2 pl-5'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-small-strong text-basic-negative font-medium'
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
						styles='bg-basic-gray-active text-basic-gray !py-1 px-4'
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default DeleteSubjectModal;
