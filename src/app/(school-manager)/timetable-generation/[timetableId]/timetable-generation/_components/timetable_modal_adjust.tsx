'use client';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import { Box, IconButton, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import ContainedButton from '@/commons/button-contained';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebaseConfig';
import useNotify from '@/hooks/useNotify';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IConfigurationAdjustModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

const ConfigurationAdjustModal = (props: IConfigurationAdjustModalProps) => {
	const { open, setOpen } = props;
	const { dataStored, dataFirestoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useDispatch();

	const [minutes, setMinutes] = useState<number | ''>('');

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setMinutes(value === '' ? '' : parseInt(value));
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSaveChanges = async () => {
		if (dataStored && dataStored.id && dataFirestoreName && typeof minutes === 'number') {
			const docRef = doc(firestore, dataFirestoreName, dataStored.id);
			await setDoc(
				docRef,
				{
					...dataStored,
					'max-execution-time-in-seconds': minutes * 60,
				},
				{ merge: true }
			);
			dispatch(updateDataStored({ target: 'max-execution-time-in-seconds', value: minutes * 60 }));
			useNotify({
				message: 'Cấu hình TKB thành công',
				type: 'success',
			});
			handleClose();
		}
	};

	useEffect(() => {
		if (open && dataStored) {
			setMinutes(dataStored['max-execution-time-in-seconds'] / 60);
		}
	}, [dataStored, open]);

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
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-1'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-body-xlarge font-normal opacity-60'
					>
						Điều chỉnh Thời khóa biểu
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit flex flex-col justify-start items-center p-3'>
					<div className='w-full h-fit flex flex-row justify-between items-baseline'>
						<h3>Thời gian tạo TKB</h3>
						<TextField
							select
							label='Chọn số phút để chạy thuật toán TKB'
							value={minutes}
							defaultValue={minutes}
							variant='standard'
							onChange={handleInputChange}
							sx={{ width: '70%' }}
						>
							<MenuItem value={5}>5 phút</MenuItem>
							<MenuItem value={10}>10 phút</MenuItem>
							<MenuItem value={15}>15 phút</MenuItem>
						</TextField>
					</div>
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
						onClick={handleSaveChanges}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default ConfigurationAdjustModal;
