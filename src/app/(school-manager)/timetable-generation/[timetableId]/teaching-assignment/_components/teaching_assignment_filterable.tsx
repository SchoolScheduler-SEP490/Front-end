'use client';

import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSMSelector } from '@/hooks/useReduxStore';
import CloseIcon from '@mui/icons-material/Close';
import {
	Button,
	Collapse,
	IconButton,
	Paper,
	SelectChangeEvent,
	TextField,
	Typography,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { KeyedMutator } from 'swr';

interface ITeachingAssignmentFilterableProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedTermId: number;
	setSelectedTermId: React.Dispatch<React.SetStateAction<number>>;
	mutate?: KeyedMutator<any>;
	termStudyOptions: IDropdownOption<number>[];
	setIsApplyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	maxPeriodPerWeek: number;
	setMaxPeriodPerWeek: React.Dispatch<React.SetStateAction<number>>;
	minPeriodPerWeek: number;
	setMinPeriodPerWeek: React.Dispatch<React.SetStateAction<number>>;
	setIsSummaryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Errors {
	field1: boolean;
	field2: boolean;
	duplicate: boolean;
}

const TeachingAssignmentFilterable = (props: ITeachingAssignmentFilterableProps) => {
	const {
		open,
		setOpen,
		selectedTermId,
		setSelectedTermId,
		termStudyOptions,
		setIsApplyModalOpen,
		maxPeriodPerWeek,
		minPeriodPerWeek,
		setMaxPeriodPerWeek,
		setMinPeriodPerWeek,
		setIsSummaryModalOpen
	} = props;
	const { dataStored }: ITimetableGenerationState = useSMSelector(
		(state) => state.timetableGeneration
	);

	const [errors, setErrors] = useState<Errors>({
		field1: false,
		field2: false,
		duplicate: false,
	});

	const handleAutoAssignment = () => {
		setIsApplyModalOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleTermSelect = (event: SelectChangeEvent<number>) => {
		if (setSelectedTermId) {
			setSelectedTermId(Number(event.target.value));
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const { name, value } = e.target;

		// Cập nhật giá trị
		switch (name) {
			case 'min':
				setMinPeriodPerWeek(Number(value));
				break;
			case 'max':
				if (Number(value) <= 25) {
					setMaxPeriodPerWeek(Number(value));
				} else {
					setErrors((prev) => ({ ...prev, [name]: true }));
					setMaxPeriodPerWeek(25);
				}
				break;
		}

		// Kiểm tra giá trị có hợp lệ không
		const isInvalid = value === '' || Number(value) <= 0;
		setErrors((prev) => ({
			...prev,
			[name]: isInvalid,
		}));

		// Kiểm tra 2 giá trị có trùng nhau không
		const isDuplicate = value !== '' && value === minPeriodPerWeek.toString();
		setErrors((prev) => ({
			...prev,
			duplicate: isDuplicate,
		}));
	};

	return (
		<div
			className={`opacity-0 h-full w-[23%] flex flex-col justify-start items-center pt-[4vh] gap-3 transition-all duration-300 ease-in-out transform ${
				open ? 'translate-x-0 opacity-100' : '!w-0 translate-x-full opacity-0'
			}`}
		>
			<Button
				variant='contained'
				fullWidth
				onClick={handleAutoAssignment}
				color='inherit'
				sx={{ bgcolor: '#175b8e', color: 'white', borderRadius: 0 }}
			>
				Phân công tự động
			</Button>
			<Collapse
				in={dataStored && dataStored['teacher-assignments-summary']?.length > 0}
				sx={{ width: '100%' }}
				timeout={300}
				orientation='vertical'
			>
				<Button
					variant='contained'
					fullWidth
					onClick={() => setIsSummaryModalOpen(true)}
					color='success'
					sx={{ color: 'white', borderRadius: 0 }}
				>
					Xem tiết giáo viên
				</Button>
			</Collapse>

			<Paper className='w-full p-3 flex flex-col justify-start items-center gap-3'>
				<div className='w-full flex flex-row justify-between items-center pt-1'>
					<Typography variant='h6' className='text-title-small-strong font-normal w-full text-left'>
						Tiết học
					</Typography>
					<IconButton onClick={handleClose} className='translate-x-2'>
						<CloseIcon />
					</IconButton>
				</div>
				<TextField
					fullWidth
					type='number'
					name='max'
					label='Số tiết tối đa/tuần'
					onFocus={(event) => event.target.select()}
					value={maxPeriodPerWeek}
					onChange={handleChange}
					error={errors.field1 || errors.duplicate}
					helperText={
						errors.field1
							? 'Giá trị phải lớn hơn 0'
							: errors.duplicate
							? 'Hai số không được trùng nhau'
							: ''
					}
				/>
				<TextField
					fullWidth
					type='number'
					name='min'
					label='Số tiết tối thiểu/tuần'
					onFocus={(event) => event.target.select()}
					value={minPeriodPerWeek}
					onChange={handleChange}
					error={errors.field2 || errors.duplicate}
					helperText={
						errors.field2
							? 'Giá trị phải lớn hơn 0'
							: errors.duplicate
							? 'Hai số không được trùng nhau'
							: ''
					}
				/>
			</Paper>
		</div>
	);
};

export default TeachingAssignmentFilterable;
