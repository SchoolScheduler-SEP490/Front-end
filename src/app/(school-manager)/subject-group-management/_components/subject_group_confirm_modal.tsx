import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';
import { IVulnerableClass } from '../_libs/constants';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ISubjectGroupConfirmModalProps {
	vulnerableClasses: IVulnerableClass[];
	handleConfirm: () => void;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	newSubjectGroup: string;
}

const ApllyConfirmationModal = (props: ISubjectGroupConfirmModalProps) => {
	const { vulnerableClasses, handleConfirm, setOpen, open, newSubjectGroup } = props;

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
					className='w-full h-fit flex flex-row justify-between items-center bg-basic-gray-active p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Xác nhận thay đổi
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit px-5 py-[3vh]'>
					<h2 className='text-title-medium font-normal w-full text-left'>
						Xác nhận lưu những thay đổi
					</h2>
					{vulnerableClasses.length > 0 && (
						<div>
							<h2 className='text-body-large-strong text-tertiary-normal'>
								Những môn học sau sẽ được cập nhật tổ hợp môn
							</h2>
							<ul className='!list-disc pl-4'>
								{vulnerableClasses.map((item, index) => (
									<li
										key={index}
										className='flex flex-row justify-start items-center gap-2'
									>
										<p className='text-body-small font-normal'>
											{item.className}:
										</p>
										<p className='text-body-small font-normal text-basic-negative'>
											{item.existingGroupName}
										</p>
										<ArrowRightAltIcon />
										<p className='text-body-small font-normal text-primary-500'>
											{newSubjectGroup}
										</p>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='xác nhận'
						disableRipple
						type='button'
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleConfirm}
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

export default ApllyConfirmationModal;
