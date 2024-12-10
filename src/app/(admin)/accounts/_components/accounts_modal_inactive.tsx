import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';

const style = {
	position: 'absolute',
	top: '40%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '35vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

const formatDateString = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

interface IAccountInactiveModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleConfirm: () => void;
	selectedAccountName: string;
}

const AccountInactiveModal = (props: IAccountInactiveModalProps) => {
	const { setOpen, open, handleConfirm, selectedAccountName } = props;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-basic-gray-hover p-3 py-1'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-small-strong font-normal opacity-60'
					>
						Xác nhận thay đổi
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit min-h-[10vh] p-3 flex flex-col justify-center items-start '>
					<h1 className='text-body-large-strong'>
						Xác nhận vô hiệu tài khoản <strong>{selectedAccountName}</strong>?
					</h1>
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover px-3 py-2'
				>
					<ContainedButton
						title='hủy'
						disableRipple
						onClick={handleClose}
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-3'
					/>
					<ContainedButton
						title='xác nhận'
						disableRipple
						type='button'
						styles='!bg-basic-negative !text-white !py-1 px-3'
						onClick={handleConfirm}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default AccountInactiveModal;
