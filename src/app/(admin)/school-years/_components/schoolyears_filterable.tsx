import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { ISchoolYearResponse } from '@/utils/constants';
import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton, Paper, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { KeyedMutator } from 'swr';
import { getCreateSchoolYearApi } from '../_libs/apis';
import { ICreateSchoolYearRequest } from '../_libs/constants';

interface ISchoolYearFilterableProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	yearData: ISchoolYearResponse[];
	updateData: KeyedMutator<any>;
}

const SchoolYearsFilterable: React.FC<ISchoolYearFilterableProps> = (props) => {
	const { open, setOpen, yearData, updateData } = props;
	const { sessionToken } = useAppContext();

	const currentYear = dayjs().year(); // Lấy năm hiện tại
	const [academicYearCode, setAcademicYearCode] = useState<string>('');
	const [startYear, setStartYear] = useState<number>(currentYear);
	const [endYear, setEndYear] = useState<number>(currentYear + 1);
	const [yearError, setYearError] = useState<string | null>(null);
	const [firstTermStartDate, setFirstTermStartDate] = useState<Dayjs | null>(null);
	const [secondTermStartDate, setSecondTermStartDate] = useState<Dayjs | null>(null);

	// Xử lý thay đổi năm bắt đầu
	const handleStartYearChange = (value: string) => {
		const year = parseInt(value, 10);
		if (
			!isNaN(year) &&
			year >= currentYear &&
			!yearData.some((year) => year['start-year'] === value)
		) {
			setStartYear(year);
			setEndYear(year + 1);
			setFirstTermStartDate(dayjs(new Date(year, 6, 1)));
			setSecondTermStartDate(dayjs(new Date(year + 1, 0, 1)));
			setYearError(null);
		} else if (isNaN(year) && year < currentYear) {
			setStartYear(year);
			setEndYear(year + 1);
			setFirstTermStartDate(dayjs(new Date(year, 6, 1)));
			setSecondTermStartDate(dayjs(new Date(year + 1, 0, 1)));
			setYearError('Năm học không hợp lệ');
		} else if (yearData.some((year) => year['start-year'] === value)) {
			setStartYear(year);
			setEndYear(year + 1);
			setFirstTermStartDate(dayjs(new Date(year, 6, 1)));
			setSecondTermStartDate(dayjs(new Date(year + 1, 0, 1)));
			setYearError('Năm học đã tồn tại');
		}
		setStartYear(year);
		setEndYear(year + 1);
		setFirstTermStartDate(dayjs(new Date(year, 6, 1)));
		setSecondTermStartDate(dayjs(new Date(year + 1, 0, 1)));
	};

	// Xử lý thay đổi năm kết thúc
	const handleEndYearChange = (value: string) => {
		const year = parseInt(value, 10);
		if (!isNaN(year) && year >= startYear) {
			setEndYear(year);
		}
	};

	const handleClose = () => {
		setAcademicYearCode('');
		setStartYear(currentYear);
		setEndYear(currentYear + 1);
		setYearError(null);
		setOpen(false);
	};

	// Submit thông tin năm học
	const handleSubmit = async () => {
		if (!academicYearCode || !startYear || !endYear) {
			alert('Vui lòng nhập đầy đủ thông tin!');
			return;
		}
		const endpoint = getCreateSchoolYearApi();
		const formData: ICreateSchoolYearRequest = {
			'school-year-code': academicYearCode,
			'start-year': startYear.toString(),
			'end-year': endYear.toString(),
			'start-date-hk1': firstTermStartDate?.toISOString() ?? '',
			'start-date-hk2': secondTermStartDate?.toISOString() ?? '',
		};

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionToken}`,
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			const data = await response.json();
			useNotify({
				message: data?.message ?? 'Thêm năm học thành công',
				type: 'success',
			});
			updateData();
		} else {
			const data = await response.json();
			useNotify({
				message: data?.message ?? 'Thêm năm học thất bại',
				type: 'success',
			});
		}

		handleClose();
	};

	return (
		<div
			className={`opacity-0 h-full w-[30%] flex flex-col justify-start items-center pt-1 gap-3 transition-all duration-300 ease-in-out transform ${
				open ? 'translate-x-0 opacity-100' : '!w-0 translate-x-full opacity-0'
			}`}
		>
			<Paper className='w-full p-3 flex flex-col justify-start items-center gap-3'>
				<div className='w-full flex flex-row justify-between items-center pt-1'>
					<Typography variant='h6' className='text-title-small-strong font-normal w-full text-left'>
						Thêm năm học
					</Typography>
					<IconButton onClick={handleClose} className='translate-x-2'>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-fit flex flex-col gap-4'>
					{/* Existing fields */}
					<TextField
						fullWidth
						label='Mã năm học'
						variant='standard'
						margin='dense'
						value={academicYearCode}
						autoComplete='off'
						onChange={(e) => setAcademicYearCode(e.target.value)}
					/>

					<div className='w-full h-fit flex flex-row justify-between items-baseline gap-2'>
						<TextField
							label='Năm bắt đầu'
							variant='standard'
							margin='dense'
							type='number'
							inputProps={{ min: currentYear }}
							value={startYear}
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
							inputProps={{ min: startYear }}
							value={endYear}
							onChange={(e) => handleEndYearChange(e.target.value)}
						/>
					</div>

					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
						<div className='w-full h-fit flex flex-col justify-start gap-5'>
							<DatePicker
								label='Ngày bắt đầu kỳ 1'
								value={firstTermStartDate}
								onChange={(newValue) => setFirstTermStartDate(newValue)}
								minDate={dayjs(new Date(startYear, 0, 1))} // 1st January of startYear
								maxDate={dayjs(new Date(startYear, 11, 31))} // 31st December of endYear
								format='DD/MM/YYYY'
							/>

							<DatePicker
								label='Ngày bắt đầu kỳ 2'
								value={secondTermStartDate}
								onChange={(newValue) => setSecondTermStartDate(newValue)}
								minDate={dayjs(new Date(endYear, 0, 1))} // Start from startYear
								maxDate={dayjs(new Date(endYear, 11, 31))} // End at endYear
								format='DD/MM/YYYY'
							/>
						</div>
					</LocalizationProvider>
				</div>
				<div className='w-full h-fit flex flex-row justify-between items-center'>
					<Button
						variant='contained'
						color='inherit'
						// onClick={() => setIsCancelConfirmModalOpen(true)}
						sx={{ width: '30%', backgroundColor: '#E0E0E0', borderRadius: 0, boxShadow: 'none' }}
					>
						Hủy
					</Button>
					<Button
						variant='contained'
						color='inherit'
						onClick={handleSubmit}
						disabled={yearError !== null}
						sx={{
							width: '60%',
							backgroundColor: '#004e89',
							color: 'white',
							borderRadius: 0,
							boxShadow: 'none',
						}}
					>
						Thêm mới
					</Button>
				</div>
			</Paper>
		</div>
	);
};

export default SchoolYearsFilterable;
