import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { TermSeperatedAssignedObject } from '../_libs/constants';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IQuickApplyModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	data: TermSeperatedAssignedObject;
}

const LessonQuickApplyModal = (props: IQuickApplyModalProps) => {
	const { open, setOpen, data } = props;

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Xếp tiết nhanh
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-[60vh] relative flex flex-row justify-start items-start overflow-hidden'></div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='chọn tổ hợp áp dụng'
						disableRipple
						// disabled={editingDepartment.length === 0}
						// onClick={() => setIsConfirmOpen(true)}
						styles='bg-primary-300 text-white !py-1 px-4'
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default LessonQuickApplyModal;
