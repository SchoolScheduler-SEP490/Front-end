'use client';

import { useAppContext } from '@/context/app_provider';
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
import useFetchTerm from '../_hooks/useFetchFilterTerm';
import { ISchoolYearResponse, ITermResponse } from '../_libs/constants';
import useFetchSchoolYear from '../_hooks/useFetchSchoolYear';
import { IDropdownOption } from '../../_utils/contants';

interface ISortableDropdown<T> extends IDropdownOption<T> {
	criteria: string | number;
}

interface ITeachingAssignmentFilterableProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedTermId: number;
	setSelectedTermId: React.Dispatch<React.SetStateAction<number>>;
	selectedYearId: number;
	setSelectedYearId: React.Dispatch<React.SetStateAction<number>>;
	mutate?: KeyedMutator<any>;
}

const TeachingAssignmentFilterable = (props: ITeachingAssignmentFilterableProps) => {
	const {
		open,
		setOpen,
		selectedTermId,
		setSelectedTermId,
		selectedYearId,
		setSelectedYearId,
	} = props;
	const { sessionToken, schoolId } = useAppContext();
	const { data: termData, error: termFetchError } = useFetchTerm({
		sessionToken,
		schoolId,
	});
	const { data: schoolyearData, error: schoolyearError } = useFetchSchoolYear();
	const [termStudyOptions, setTermStudyOptions] = useState<IDropdownOption<number>[]>(
		[]
	);
	const [yearStudyOptions, setYearStudyOptions] = useState<IDropdownOption<number>[]>(
		[]
	);

	useEffect(() => {
		if (termData?.status === 200) {
			const studyOptions: ISortableDropdown<number>[] = termData.result.map(
				(item: ITermResponse) => ({
					value: item.id,
					label: `${item.name} | (${item['school-year-start']}-${item['school-year-end']}) `,
					criteria: item.name,
				})
			);
			setTermStudyOptions(
				studyOptions.sort((a, b) =>
					(a.criteria as string).localeCompare(b.criteria as string)
				)
			);
		}
	}, [termData]);

	useEffect(() => {
		if (schoolyearData?.status === 200) {
			const studyOptions: ISortableDropdown<number>[] = schoolyearData.result.map(
				(item: ISchoolYearResponse) => ({
					value: item.id,
					label: `${item['start-year']} - ${item['end-year']}`,
					criteria: item['start-year'],
				})
			);
			setYearStudyOptions(
				studyOptions.sort((a, b) =>
					(a.criteria as string).localeCompare(b.criteria as string)
				)
			);
		}
	}, [schoolyearData]);

	useEffect(() => {
		if (termData?.status === 200) {
			const termInYear: ITermResponse[] = termData.result.filter(
				(term: ITermResponse) => term['school-year-id'] === selectedYearId
			);
			if (termInYear.length > 0) {
				const studyOptions: ISortableDropdown<number>[] = termInYear.map(
					(item: ITermResponse) => ({
						value: item.id,
						label: `${item.name} | (${item['school-year-start']}-${item['school-year-end']}) `,
						criteria: item.name,
					})
				);
				setTermStudyOptions(
					studyOptions.sort((a, b) =>
						(a.criteria as string).localeCompare(b.criteria as string)
					)
				);
				setSelectedTermId(studyOptions[0].value);
			}
		}
	}, [selectedYearId]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleTermSelect = (event: SelectChangeEvent<number>) => {
		if (setSelectedTermId) {
			setSelectedTermId(Number(event.target.value));
		}
	};
	const handleYearSelect = (event: SelectChangeEvent<number>) => {
		if (setSelectedYearId) {
			setSelectedYearId(Number(event.target.value));
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
