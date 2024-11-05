import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, styled, Typography } from '@mui/material';
import React from 'react';
import { ITeachingAssignmentTableData } from '../_libs/constants';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

const Div = styled('div')(({ theme }) => ({
	...theme.typography.button,
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(1),
}));

interface IApplyModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	applicableSubjects: ITeachingAssignmentTableData[];
}

const TeachingAssignmentApplyModal = (props: IApplyModalProps) => {
	const { open, setOpen, applicableSubjects } = props;

	const [selectedSubjects, setSelectedSubjects] = React.useState<number[]>([]);

	const handleClose = () => {
		setOpen(false);
		// setIsSelecting(false);
		// setSelectedClasses([]);
		// setTmpSelectedClasses([]);
	};

	return (
		<Modal
			open={open}
			// onClose={handleClose}
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
						Áp dụng phân công giảng dạy
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>

				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='áp dụng'
						disableRipple
						type='button'
						// disabled={selectedClasses.length === 0}
						styles='bg-primary-300 text-white !py-1 px-4'
						// onClick={handleConfirmApply}
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

export default TeachingAssignmentApplyModal;
