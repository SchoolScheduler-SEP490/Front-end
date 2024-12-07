import React from 'react';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import ContainedButton from '@/commons/button-contained';
import { KeyedMutator } from 'swr';
import useDeleteTeacher from '../_hooks/useDeleteTeacher';
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

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: (close: boolean) => void;
  teacherName: string;
  teacherId: number;
  mutate: KeyedMutator<any>;
}

const DeleteTeacherModal = (props: DeleteConfirmationModalProps) => {
  const { open, onClose, teacherName, teacherId, mutate } = props;
  const { deleteTeacher } = useDeleteTeacher();

  const handleClose = () => {
    onClose(false);
  };

  const handleDeleteTeacher = async () => {
    await deleteTeacher(teacherId);
    mutate();
    handleClose();
  };
  return (
		<Modal
			keepMounted
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
					className='w-full h-fit flex flex-row justify-between items-center p-2 pl-5'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-large-strong font-semibold'
					>
						Xóa giáo viên
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='p-4 pl-5'>
					<Typography className='text-title-small-strong'>
						Bạn có chắc muốn xóa giáo viên <strong>{teacherName}</strong> không? Thao tác này không thể hoàn tác.
					</Typography>
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Xóa giáo viên'
						disableRipple
						onClick={handleDeleteTeacher}
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


export default DeleteTeacherModal;
