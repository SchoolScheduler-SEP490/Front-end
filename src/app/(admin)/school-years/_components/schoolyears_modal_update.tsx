import ContainedButton from '@/commons/button-contained';
import { ISchoolYearResponse } from '@/utils/constants';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { IUpdateSchoolYearRequest } from '../_libs/constants';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getUpdateSchoolYearApi } from '../_libs/apis';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { KeyedMutator } from 'swr';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '30vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ISchoolYearUpdateModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	selectedSchoolYear: ISchoolYearResponse;
	yearData: ISchoolYearResponse[];
	updateData: KeyedMutator<any>;
}

const SchoolYearUpdateModal = (props: ISchoolYearUpdateModalProps) => {
	const { setOpen, open, selectedSchoolYear, yearData, updateData } = props;
	const { sessionToken } = useAppContext();

	const [editingObject, setEditingObject] = useState<IUpdateSchoolYearRequest>(
		{} as IUpdateSchoolYearRequest
	);
	const currentYear = dayjs().year(); // Lấy năm hiện tại
	const [yearError, setYearError] = useState<string | null>(null);

	useEffect(() => {
		if (selectedSchoolYear) {
			setEditingObject({
				'start-year': selectedSchoolYear['start-year'],
				'end-year': selectedSchoolYear['end-year'],
				'school-year-code': selectedSchoolYear['school-year-code'],
				'start-date-hk1':
					selectedSchoolYear['term-view-model']?.find((item) => item.name === 'HK1')?.[
						'start-date'
					] ?? '',
				'start-date-hk2':
					selectedSchoolYear['term-view-model']?.find((item) => item.name === 'HK2')?.[
						'start-date'
					] ?? '',
			});
		}
	}, [selectedSchoolYear]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleFormSubmit = async () => {
		const endpoint = getUpdateSchoolYearApi(selectedSchoolYear.id);
		const response = await fetch(endpoint, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
			body: JSON.stringify(editingObject),
		});
		if (response.ok) {
			const data = await response.json();
			useNotify({
				message: data.message ?? 'Cập nhật năm học thành công',
				type: 'success',
			});
			updateData();
			handleClose();
		} else {
			const data = await response.json();
			useNotify({
				message: data.message ?? 'Cập nhật năm học thất bại',
				type: 'error',
			});
		}
	};

	// Xử lý thay đổi năm bắt đầu
	const handleStartYearChange = (value: string) => {
		const year = parseInt(value, 10);
		if (
			!isNaN(year) &&
			year >= currentYear &&
			!yearData.some((year) => year['start-year'] === value)
		) {
			setEditingObject(
				(prev: IUpdateSchoolYearRequest) =>
					({
						...prev,
						'start-year': year.toString(),
						'end-year': (year + 1).toString(),
						'start-date-hk1': dayjs(new Date(year, 6, 1)).toISOString() ?? '',
						'second-term-start-date': dayjs(new Date(year + 1, 0, 1)).toISOString() ?? '',
					} as IUpdateSchoolYearRequest)
			);
			setYearError(null);
		} else if (isNaN(year) && year < currentYear) {
			setEditingObject(
				(prev: IUpdateSchoolYearRequest) =>
					({
						...prev,
						'start-year': year.toString(),
						'end-year': (year + 1).toString(),
						'start-date-hk1': dayjs(new Date(year, 6, 1)).toISOString() ?? '',
						'second-term-start-date': dayjs(new Date(year + 1, 0, 1)).toISOString() ?? '',
					} as IUpdateSchoolYearRequest)
			);
			setYearError('Năm học không hợp lệ');
		} else if (yearData.some((year) => year['start-year'] === value)) {
			setEditingObject(
				(prev: IUpdateSchoolYearRequest) =>
					({
						...prev,
						'start-year': year.toString(),
						'end-year': (year + 1).toString(),
						'start-date-hk1': dayjs(new Date(year, 6, 1)).toISOString() ?? '',
						'second-term-start-date': dayjs(new Date(year + 1, 0, 1)).toISOString() ?? '',
					} as IUpdateSchoolYearRequest)
			);
			setYearError('Năm học đã tồn tại');
		}
		setEditingObject(
			(prev: IUpdateSchoolYearRequest) =>
				({
					...prev,
					'start-year': year.toString(),
					'end-year': (year + 1).toString(),
					'start-date-hk1': dayjs(new Date(year, 6, 1)).toISOString() ?? '',
					'second-term-start-date': dayjs(new Date(year + 1, 0, 1)).toISOString() ?? '',
				} as IUpdateSchoolYearRequest)
		);
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
						Xác nhận thay đổi
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit px-5 py-[3vh]'>
					{/* Existing fields */}
					<TextField
						fullWidth
						label='Mã năm học'
						variant='standard'
						margin='dense'
						value={editingObject['school-year-code']}
						autoComplete='off'
						onChange={(e) =>
							setEditingObject((prev) => ({ ...prev, 'school-year-code': e.target.value }))
						}
					/>

					<div className='w-full h-fit flex flex-row justify-between items-baseline gap-2'>
						<TextField
							label='Năm bắt đầu'
							variant='standard'
							margin='dense'
							type='number'
							inputProps={{ min: currentYear }}
							value={editingObject['start-year']}
							onChange={(e) => handleStartYearChange(e.target.value)}
							error={yearError !== null}
							helperText={yearError !== null ? yearError : ''}
						/>

						<h1 className='text-title-xl font-normal text-primary-400 translate-y-1'></h1>

						<TextField
							label='Năm kết thúc'
							variant='standard'
							margin='dense'
							disabled
							type='number'
							inputProps={{ min: editingObject['start-year'] }}
							value={editingObject['end-year']}
						/>
					</div>

					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
						<div className='w-full h-fit flex flex-col justify-start gap-5 pt-5'>
							<DatePicker
								label='Ngày bắt đầu kỳ 1'
								value={dayjs(new Date(editingObject['start-date-hk1']))}
								onChange={(newValue) =>
									setEditingObject((prev) => ({
										...prev,
										'start-date-hk1': newValue?.toISOString() ?? '',
									}))
								}
								minDate={dayjs(new Date(Number(editingObject['start-year']), 0, 1))} // 1st January of startYear
								maxDate={dayjs(new Date(Number(editingObject['start-year']), 11, 31))} // 31st December of endYear
								format='DD/MM/YYYY'
							/>

							<DatePicker
								label='Ngày bắt đầu kỳ 2'
								value={dayjs(new Date(editingObject['start-date-hk2']))}
								onChange={(newValue) =>
									setEditingObject((prev) => ({
										...prev,
										'start-date-hk2': newValue?.toISOString() ?? '',
									}))
								}
								minDate={dayjs(new Date(Number(editingObject['end-year']), 0, 1))} // Start from startYear
								maxDate={dayjs(new Date(Number(editingObject['end-year']), 11, 31))} // End at endYear
								format='DD/MM/YYYY'
							/>
						</div>
					</LocalizationProvider>
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover px-3 py-2'
				>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-3'
					/>
					<ContainedButton
						title='xác nhận'
						disableRipple
						type='button'
						styles='bg-primary-300 text-white !py-1 px-3'
						onClick={handleFormSubmit}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default SchoolYearUpdateModal;
