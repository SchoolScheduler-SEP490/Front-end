import { Box, IconButton, Modal, Typography } from '@mui/material';
import { ISubjectTableData } from '../../_utils/contants';
import CloseIcon from '@mui/icons-material/Close';

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
					className='w-full h-fit flex flex-row justify-between items-center bg-basic-negative-hover p-3'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong text-basic-negative font-normal opacity-60'
					>
						Xóa môn học
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
			</Box>
		</Modal>
	);
};

export default DeleteSubjectModal;
