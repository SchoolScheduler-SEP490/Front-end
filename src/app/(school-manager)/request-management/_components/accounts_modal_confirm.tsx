import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, TextField, Typography } from '@mui/material';
import React from 'react';

const style = {
	position: 'absolute',
	top: '50%',
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

interface IRequestConfirmModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleConfirm: () => void;
	processNote: string;
	setProcessNote: React.Dispatch<React.SetStateAction<string>>;
}

const RequestConfirmModal = (props: IRequestConfirmModalProps) => {
	const { setOpen, open, handleConfirm, processNote, setProcessNote } = props;

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
						Xác nhận yêu cầu
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit min-h-[10vh] p-3 flex flex-col justify-center items-start gap-3'>
					<h1 className='text-body-large-strong'>Xác nhận yêu cầu của giáo viên?</h1>
					<TextField
						label='Nhập ghi chú'
						placeholder='Viết ghi chú về yêu cầu cho giáo viên tại đây...'
						multiline
						rows={4} // Số dòng hiển thị
						variant='outlined' // Kiểu TextField
						fullWidth
						value={processNote}
						onChange={(e) => setProcessNote(e.target.value)}
						sx={{
							'& .MuiOutlinedInput-root': {
								'& fieldset': {
									borderColor: 'grey.300',
								},
								'&:hover fieldset': {
									borderColor: 'primary.main',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'primary.main',
								},
							},
						}}
					/>
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
						styles='bg-primary-300 text-white !py-1 px-3'
						onClick={handleConfirm}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default RequestConfirmModal;
