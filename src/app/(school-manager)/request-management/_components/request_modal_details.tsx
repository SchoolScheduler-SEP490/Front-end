'use client';
import ContainedButton from '@/commons/button-contained';
import { REQUEST_TYPE_TRANSLATOR } from '@/utils/constants';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, Modal, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import {
	IRequestResponse,
	IUpdateRequestBody,
	REQUEST_STATUS_TRANSLATOR,
} from '../_libs/constants';
import RequestConfirmModal from './accounts_modal_confirm';
import RequestRejectModal from './accounts_modal_reject';
import { getUpdateRequestApi } from '../_libs/apis';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { KeyedMutator } from 'swr';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

const REQUEST_STATUS_COLOR: { [key: string]: { text: string; bg: string } } = {
	Pending: { text: 'tertiary-normal', bg: 'tertiary-light-hover' },
	Approved: { text: 'basic-positive', bg: 'basic-positive-hover' },
	Rejected: { text: 'basic-negative', bg: 'basic-negative-hover' },
};

interface IRequestDetailsModalprops {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	selectedReqeust: IRequestResponse | null;
	updateData: KeyedMutator<any>;
}

const RequestDetailsModal = (props: IRequestDetailsModalprops) => {
	const { open, setOpen, selectedReqeust: selectedRequest, updateData } = props;
	const { sessionToken } = useAppContext();

	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
	const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState<boolean>(false);
	const [processNote, setProcessNote] = useState<string>('');

	const handleClose = () => {
		setOpen(false);
		setProcessNote('');
		setIsConfirmOpen(false);
		setIsRejectConfirmOpen(false);
	};

	const handleConfirm = async () => {
		const endpoint = getUpdateRequestApi(selectedRequest?.id ?? 0);
		const formData: IUpdateRequestBody = {
			'process-note': processNote,
			status: 'Approved',
		};

		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			const data = await response.json();
			useNotify({
				message: data.message ?? 'Xác nhận yêu cầu thành công',
				type: 'success',
			});
			updateData();
			handleClose();
		} else {
			const data = await response.json();
			useNotify({
				message: data.message ?? 'Không thể xác nhận yêu cầu',
				type: 'error',
			});
		}
	};

	const handleRejectConfirm = async () => {
		const endpoint = getUpdateRequestApi(selectedRequest?.id ?? 0);
		const formData: IUpdateRequestBody = {
			'process-note': processNote,
			status: 'Rejected',
		};

		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			const data = await response.json();
			useNotify({
				message: data.message ?? 'Từ chối yêu cầu thành công',
				type: 'success',
			});
			updateData();
			handleClose();
		} else {
			const data = await response.json();
			useNotify({
				message: data.message ?? 'Không thể xác nhận yêu cầu',
				type: 'error',
			});
		}
	};

	// Format ngày
	function formatDateString(dateString: string): string {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	}

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
						Chi tiết yêu cầu
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				{selectedRequest !== null && (
					<div className='w-full h-fit px-5 py-[3vh]'>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h1 className='w-max overflow-hidden text-title-medium font-medium text-ellipsis whitespace-nowrap'>
								Loại đơn: {REQUEST_TYPE_TRANSLATOR[selectedRequest['request-type']].toUpperCase()}
							</h1>
							<div
								className={`bg-${
									REQUEST_STATUS_COLOR[selectedRequest.status].bg
								} w-fit h-fit rounded-md px-2 py-1`}
							>
								<p
									className={`text-body-medium-strong font-normal text-${
										REQUEST_STATUS_COLOR[selectedRequest.status].text
									}`}
								>
									{REQUEST_STATUS_TRANSLATOR[selectedRequest.status]}
								</p>
							</div>
						</div>

						<Divider sx={{ my: 2 }} />

						{/* Thông tin giáo viên */}
						<Box display='flex' gap={1} mb={2}>
							<Typography variant='body1' fontWeight='bold'>
								Người gửi:
							</Typography>
							<Typography variant='body1'>
								{selectedRequest['teacher-first-name']} {selectedRequest['teacher-last-name']}
							</Typography>
						</Box>

						{/* Ngày tạo */}
						<Box display='flex' gap={1} mb={2}>
							<Typography variant='body1' fontWeight='bold'>
								Ngày tạo:
							</Typography>
							<Typography variant='body1'>{formatDateString(selectedRequest['create-date'])}</Typography>
						</Box>

						{/* Nội dung */}
						<Box mb={2}>
							<Typography variant='body1' fontWeight='bold'>
								Lý do:
							</Typography>
							<Typography
								variant='body2'
								sx={{ whiteSpace: 'pre-line', mt: 1, color: 'text.secondary' }}
							>
								{selectedRequest['request-description']}
							</Typography>
						</Box>

						{/* Tệp đính kèm */}
						<Box
							mt={2}
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'start',
								alignItems: 'center',
								gap: 1,
							}}
						>
							<Typography variant='body1' fontWeight='bold' gutterBottom>
								Tệp đính kèm:
							</Typography>
							{selectedRequest['attached-file'] !== null ? (
								<a
									href={selectedRequest['attached-file']}
									target='_blank'
									rel='noopener noreferrer'
									style={{
										color: '#1976d2',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: '4px',
									}}
								>
									<AttachFileIcon fontSize='small' />
									<span style={{ textDecoration: 'underline' }}>Xem file</span>
								</a>
							) : (
								<Typography variant='body2' color='text.secondary'>
									Không có tệp đính kèm
								</Typography>
							)}
						</Box>
						{selectedRequest.status !== 'Pending' && (
							<div className='w-full h-fit flex flex-col justify-center items-start gap-3 mt-3'>
								<Divider variant='middle' sx={{width: '100%'}} />
								<Box mb={2}>
									<Typography variant='body1' fontWeight='bold'>
										Ghi chú:
									</Typography>
									<Typography
										variant='body2'
										sx={{ whiteSpace: 'pre-line', mt: 1, color: 'text.secondary' }}
									>
										{selectedRequest['process-note']}
									</Typography>
								</Box>
							</div>
						)}
					</div>
				)}
				{selectedRequest && selectedRequest.status === 'Pending' && (
					<div
						id='modal-footer'
						className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover px-3 py-2'
					>
						<ContainedButton
							title='Từ chối'
							disableRipple
							onClick={() => setIsRejectConfirmOpen(true)}
							styles='!bg-basic-negative !text-white !py-1 px-3'
						/>
						<ContainedButton
							title='xác nhận'
							disableRipple
							type='button'
							styles='bg-primary-300 text-white !py-1 px-3'
							onClick={() => setIsConfirmOpen(true)}
						/>
					</div>
				)}
				<RequestConfirmModal
					processNote={processNote}
					setProcessNote={setProcessNote}
					open={isConfirmOpen}
					setOpen={setIsConfirmOpen}
					handleConfirm={handleConfirm}
				/>
				<RequestRejectModal
					processNote={processNote}
					setProcessNote={setProcessNote}
					open={isRejectConfirmOpen}
					setOpen={setIsRejectConfirmOpen}
					handleConfirm={handleRejectConfirm}
				/>
			</Box>
		</Modal>
	);
};

export default RequestDetailsModal;
