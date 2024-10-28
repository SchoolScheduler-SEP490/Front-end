'use client';

import { useAppContext } from '@/context/app_provider';
import { ICommonResponse } from '@/utils/constants';
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
import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import useFetchTerm from '../_hooks/useFetchTerm';
import { IDropdownOption, IFetchTermResponse } from '../_libs/constants';

interface ISubjectGroupFilterableProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onFilter?: () => void;
	selectedYearId: number;
	setSelectedYearId: React.Dispatch<React.SetStateAction<number>>;
	mutate?: KeyedMutator<any>;
}

const SubjectGroupFilterable = (props: ISubjectGroupFilterableProps) => {
	const { open, setOpen, onFilter, selectedYearId, setSelectedYearId } = props;
	const { sessionToken, schoolId } = useAppContext();
	const { data, mutate } = useFetchTerm({
		sessionToken: sessionToken,
		schoolId: schoolId,
	});
	const [yearStudyOptions, setYearStudyOptions] = useState<IDropdownOption<number>[]>(
		[]
	);

	useEffect(() => {
		if (data?.status === 200) {
			const response: ICommonResponse<IFetchTermResponse[]> = { ...data };
			const yearStudyOptions: IDropdownOption<number>[] = response.result.map(
				(item) => ({
					value: item.id,
					label: `${item.name} | ${item['school-year-start']} - ${item['school-year-end']}`,
				})
			);
			setYearStudyOptions(yearStudyOptions);
		}
	}, [data]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleYearSelect = (event: SelectChangeEvent<number>) => {
		if (setSelectedYearId) {
			setSelectedYearId(Number(event.target.value));
		}
	};

	return (
		<div
			className={`h-full w-[23%] flex flex-col justify-start items-center ${
				open ? 'visible ' : 'hidden'
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
						Năm học
					</InputLabel>
					<Select
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={selectedYearId}
						onChange={handleYearSelect}
					>
						{yearStudyOptions.map((item, index) => (
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

export default SubjectGroupFilterable;
