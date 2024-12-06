import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ISchoolYearResponse } from '@/utils/constants';

interface ISchoolYearFilterableProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	yearData: ISchoolYearResponse[];
}

const SchoolYearsFilterable: React.FC<ISchoolYearFilterableProps> = (props) => {
	const { open, setOpen, yearData } = props;

	const currentYear = dayjs().year(); // Lấy năm hiện tại
	const [academicYearCode, setAcademicYearCode] = useState<string>('');
	const [startYear, setStartYear] = useState<number>(currentYear);
	const [yearError, setYearError] = useState<string | null>(null);
	const [endYear, setEndYear] = useState<number>(currentYear + 1);
	const [isInternal, setIsInternal] = useState<boolean>(false);

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
			setYearError(null);
		} else if (isNaN(year) && year < currentYear) {
			setStartYear(year);
			setEndYear(year + 1);
			setYearError('Năm học không hợp lệ');
		} else if (yearData.some((year) => year['start-year'] === value)) {
			setStartYear(year);
			setEndYear(year + 1);
			setYearError('Năm học đã tồn tại');
		}
		setStartYear(year);
		setEndYear(year + 1);
	};

	// Xử lý thay đổi năm kết thúc
	const handleEndYearChange = (value: string) => {
		const year = parseInt(value, 10);
		if (!isNaN(year) && year >= startYear) {
			setEndYear(year);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	// Submit thông tin năm học
	const handleSubmit = () => {
		if (!academicYearCode || !startYear || !endYear) {
			alert('Vui lòng nhập đầy đủ thông tin!');
			return;
		}

		const academicYearData = {
			code: academicYearCode,
			startYear,
			endYear,
			type: isInternal ? 'Nội bộ' : 'Công khai',
		};

		console.log('Thông tin năm học:', academicYearData);
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
					<h1 className='text-title-xl font-normal text-primary-400 translate-y-1'>-</h1>
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
						// onClick={() => setIsSaveChangesConfirmModalOpen(true)}
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
