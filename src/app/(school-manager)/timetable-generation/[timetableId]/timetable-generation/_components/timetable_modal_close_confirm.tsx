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

interface ITimetableCancelConfirmModalProps {
	open: boolean;
	setOpen: (status: boolean) => void;
	handleApprove: () => void;
}

const TimetableCancelConfirmModal = (props: ITimetableCancelConfirmModalProps) => {
	const { open, setOpen, handleApprove } = props;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
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
						className='text-title-large-strong font-semibold !opacity-80'
					>
						Huỷ cập nhật
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='p-4 pl-5'>
					<Typography className='text-title-small-strong'>
						Bạn có chắc muốn huỷ thay đổi?
					</Typography>
					<p className='text-body-small italic opacity-80'>
						Những dữ liệu mà bạn nhập sẽ không được lưu lại
					</p>
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Huỷ cập nhật'
						disableRipple
						onClick={handleApprove}
						styles='bg-red-200 text-basic-negative text-normal !py-1 px-4'
					/>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default TimetableCancelConfirmModal;
