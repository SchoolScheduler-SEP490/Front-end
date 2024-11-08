'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { KeyedMutator } from 'swr';
import { IDropdownOption } from '../../_utils/contants';

interface ITeachingAssignmentFilterableProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedTermId: number;
	setSelectedTermId: React.Dispatch<React.SetStateAction<number>>;
	mutate?: KeyedMutator<any>;
	termStudyOptions: IDropdownOption<number>[];
}

const TeachingAssignmentFilterable = (props: ITeachingAssignmentFilterableProps) => {
	const { open, setOpen, selectedTermId, setSelectedTermId, termStudyOptions } = props;

	const handleClose = () => {
		setOpen(false);
	};

	const handleTermSelect = (event: SelectChangeEvent<number>) => {
		if (setSelectedTermId) {
			setSelectedTermId(Number(event.target.value));
		}
	};

	return (
		<div
			className={`h-full w-[23%] flex flex-col justify-start items-center pt-[2vh] ${
				open
					? 'visible animate-fade-left animate-once animate-duration-500 animate-ease-out'
					: 'hidden'
			}`}
		>
			<Paper className='w-full p-3 flex flex-col justify-start items-center gap-3'>
				<div className='w-full flex flex-row justify-between items-center pt-1'>
					<Typography
						variant='h6'
						className='text-title-small-strong font-normal w-full text-left'
					>
						Bộ lọc
					</Typography>
					<IconButton onClick={handleClose} className='translate-x-2'>
						<CloseIcon />
					</IconButton>
				</div>
				<FormControl fullWidth variant='filled' sx={{ m: 1, minWidth: 120 }}>
					<InputLabel
						id='demo-simple-select-filled-label'
						className='!text-body-xlarge font-normal'
					>
						Học kỳ
					</InputLabel>
					<Select
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={selectedTermId}
						onChange={handleTermSelect}
					>
						{termStudyOptions.map((item, index) => (
							<MenuItem key={item.value + index} value={item.value}>
								{item.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Paper>
		</div>
	);
};

export default TeachingAssignmentFilterable;
