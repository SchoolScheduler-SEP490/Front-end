import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';

const style = {
	position: 'absolute',
	top: '40%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IPublishTimetableConfirmModalProps {
	open: boolean;
	setOpen: (status: boolean) => void;
	handleApprove: (isPermanent: boolean) => void;
}

const PublishTimetableConfirmModal = (props: IPublishTimetableConfirmModalProps) => {
	const { open, setOpen, handleApprove } = props;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
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
						className='text-title-large-strong font-semibold !opacity-80'
					>
						Áp dụng cập nhật
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='p-4 pl-5'>
					<Typography className='text-title-small-strong'>
						Áp dụng những thay đổi cho 1 tuần hoặc cho toàn bộ Thời khóa biểu?
					</Typography>
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Áp dụng toàn bộ'
						onClick={() => handleApprove(true)}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='Áp dụng một lần'
						disableRipple
						onClick={() => handleApprove(false)}
						styles='bg-primary-400 text-white text-normal !py-1 px-4'
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default PublishTimetableConfirmModal;
