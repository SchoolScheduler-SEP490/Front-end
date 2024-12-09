import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';
import { ACCOUNT_STATUS } from '../../_utils/constants';
import { IAccountResponse } from '../_libs/constants';

const style = {
	position: 'absolute',
	top: '40%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '30vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IDashboardRequestModalProps {
	selectedAccount: IAccountResponse;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleProcess: (newStatus: string) => void;
}

const formatDateString = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

const DashboardRequestModal = (props: IDashboardRequestModalProps) => {
	const { handleProcess, setOpen, open, selectedAccount: data } = props;

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
						className='text-title-medium-strong font-normal opacity-60'
					>
						Yêu cầu đăng ký tài khoản
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit p-3 flex flex-col justify-start items-start '>
					<div className='w-full h-fit flex flex-row justify-start item-center gap-2 py-2'>
						<Typography variant='body1' sx={{ fontWeight: 'bold', display: 'inline' }}>
							Tên trường:
						</Typography>{' '}
						<Typography variant='body1' sx={{ display: 'inline' }}>
							{data['school-name']}
						</Typography>
					</div>{' '}
					<div className='w-full h-fit flex flex-row justify-start item-center gap-2 py-2'>
						<Typography variant='body1' sx={{ fontWeight: 'bold', display: 'inline' }}>
							Email:
						</Typography>{' '}
						<Typography variant='body1' sx={{ display: 'inline' }}>
							{data.email}
						</Typography>
					</div>{' '}
					<div className='w-full h-fit flex flex-row justify-start item-center gap-2 py-2'>
						<Typography variant='body1' sx={{ fontWeight: 'bold', display: 'inline' }}>
							Số điện thoại:
						</Typography>{' '}
						<Typography variant='body1' sx={{ display: 'inline' }}>
							{data.phone}
						</Typography>
					</div>{' '}
					<div className='w-full h-fit flex flex-row justify-start item-center gap-2 py-2'>
						<Typography variant='body1' sx={{ fontWeight: 'bold', display: 'inline' }}>
							Trạng thái:
						</Typography>{' '}
						<Typography variant='body1' sx={{ display: 'inline' }}>
							<span
								className={`font-semibold ${
									data.status === 'Pending' ? 'text-tertiary-normal' : ''
								}`}
							>
								{ACCOUNT_STATUS[data.status]}
							</span>
						</Typography>
					</div>{' '}
					<div className='w-full h-fit flex flex-row justify-start item-center gap-2 py-2'>
						<Typography variant='body1' sx={{ fontWeight: 'bold', display: 'inline' }}>
							Ngày tạo:
						</Typography>{' '}
						<Typography variant='body1' sx={{ display: 'inline' }}>
							{formatDateString(data['create-date'])}
						</Typography>
					</div>
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover px-3 py-2'
				>
					<ContainedButton
						title='Từ chối'
						disableRipple
						onClick={() => handleProcess('Inactive')}
						styles='!bg-basic-negative !text-white !py-1 px-3'
					/>
					<ContainedButton
						title='xác nhận'
						disableRipple
						type='button'
						styles='bg-primary-300 text-white !py-1 px-3'
						onClick={() => handleProcess('Active')}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default DashboardRequestModal;
