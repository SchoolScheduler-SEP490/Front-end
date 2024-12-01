'use client';
import {
	Box,
	IconButton,
	Modal,
	styled,
	Tooltip,
	tooltipClasses,
	TooltipProps,
	Typography,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ContainedButton from '@/commons/button-contained';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}));

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '80vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ITimetableEditModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const TimetableEditModal = (props: ITimetableEditModalProps) => {
	const { open, setOpen } = props;

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
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Điều chỉnh Thời khóa biểu
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit max-h-[80vh] flex flex-col justify-start items-center'>
					{/* Add something here */}
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='áp dụng'
						disableRipple
						type='button'
						styles='bg-primary-300 text-white !py-1 px-4'
						// onClick={handleSaveChanges}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default TimetableEditModal;
