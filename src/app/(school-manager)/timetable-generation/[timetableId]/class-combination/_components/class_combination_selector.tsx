'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import {
	Autocomplete,
	Button,
	Checkbox,
	Paper,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { IClassResponse } from '../_libs/constants';

interface ClassCombinationSelectorProps {
	subjectOptions: IDropdownOption<number>[];
	gradeOptions: IDropdownOption<number>[];
	sessionOptions: IDropdownOption<string>[];
	classOptions: IClassResponse[];
	selectedSubjectId: number;
	setSelectedSubjectId: Dispatch<SetStateAction<number>>;
	selectedGradeId: number;
	setSelectedGradeId: Dispatch<SetStateAction<number>>;
	selectedClassIds: number[];
	setSelectedClassIds: Dispatch<SetStateAction<number[]>>;
	selectedMainSession: string;
	setSelectedMainSession: Dispatch<SetStateAction<string>>;
	isLoading: boolean;
	handleSavechanges: () => void;
	handleDiscardChanges: () => void;
}

const ClassCombinationSelector = (props: ClassCombinationSelectorProps) => {
	const {
		subjectOptions,
		gradeOptions,
		sessionOptions,
		classOptions,
		selectedGradeId,
		selectedMainSession,
		selectedSubjectId,
		setSelectedGradeId,
		setSelectedMainSession,
		setSelectedSubjectId,
		setSelectedClassIds,
		selectedClassIds,
		isLoading,
		handleSavechanges,
		handleDiscardChanges,
	} = props;

	const [isSelecting, setIsSelecting] = useState<boolean>(false);

	const handleSelectSubject = (subjectKey: number) => {
		setSelectedSubjectId(subjectKey);
	};

	const handleSelectGrade = (gradeKey: number) => {
		setSelectedGradeId(gradeKey);
	};

	const handleSelectSession = (sessionKey: string) => {
		setSelectedMainSession(sessionKey);
	};

	const handleSelectRow = (id: number) => {
		setSelectedClassIds((prevSelected) =>
			prevSelected.includes(id)
				? prevSelected.filter((rowId) => rowId !== id)
				: [...prevSelected, id]
		);
	};

	const handleMouseDown = (event: any, id: number) => {
		setIsSelecting(true);
		if (event.shiftKey) {
			const currentIndex = classOptions.findIndex((row) => row.id === id);
			const lastIndex = classOptions.findIndex(
				(row) => row.id === selectedClassIds[selectedClassIds.length - 1]
			);
			const newSelectedRows = [...selectedClassIds];

			if (currentIndex > lastIndex) {
				for (let i = lastIndex + 1; i <= currentIndex; i++) {
					if (!newSelectedRows.includes(classOptions[i].id)) {
						newSelectedRows.push(classOptions[i].id);
					} else {
						newSelectedRows.splice(newSelectedRows.indexOf(classOptions[i].id), 1);
					}
				}
			} else {
				for (let i = currentIndex; i <= lastIndex; i++) {
					if (!newSelectedRows.includes(classOptions[i].id)) {
						newSelectedRows.push(classOptions[i].id);
					} else {
						newSelectedRows.splice(newSelectedRows.indexOf(classOptions[i].id), 1);
					}
				}
			}
			setSelectedClassIds(newSelectedRows);
		} else {
			handleSelectRow(id);
		}
	};

	const handleMouseEnter = (id: number) => {
		if (isSelecting) {
			handleSelectRow(id);
		}
	};

	const handleMouseUp = () => {
		setIsSelecting(false);
	};

	return (
		<div className='w-[40%] h-[100vh] flex flex-col justify-start items-center gap-[3vh] pt-[5vh] px-[2vw] border-r-1 border-basic-gray-active'>
			<div className='w-full h-fit flex justify-end items-center gap-5'>
				<Button
					variant='contained'
					color='error'
					disabled={selectedClassIds.length === 0}
					sx={{ borderRadius: 0, boxShadow: 'none', paddingY: '3px' }}
					onClick={handleDiscardChanges}
				>
					Hủy
				</Button>
				<Button
					variant='contained'
					color='success'
					disabled={selectedClassIds.length === 0}
					sx={{ borderRadius: 0, boxShadow: 'none', paddingY: '3px' }}
					onClick={handleSavechanges}
				>
					Thêm lớp gộp
				</Button>
			</div>
			<div className='w-full h-fit flex flex-row justify-center items-center gap-[3vw]'>
				<Autocomplete
					options={subjectOptions}
					getOptionLabel={(option: IDropdownOption<number>) => option.label}
					getOptionKey={(option: IDropdownOption<number>) => option.value}
					fullWidth
					noOptionsText='Không có lớp học phù hợp'
					disableClearable
					defaultValue={subjectOptions.find(
						(option) => option.value === selectedSubjectId
					)}
					onChange={(event: any, newValue: IDropdownOption<number> | null) => {
						if (newValue !== null) {
							handleSelectSubject(newValue.value);
						}
					}}
					blurOnSelect
					renderInput={(params) => (
						<TextField {...params} variant='standard' label='Môn học' />
					)}
					sx={{ width: '80%' }}
				/>
				<Autocomplete
					options={gradeOptions}
					getOptionLabel={(option: IDropdownOption<number>) => option.label}
					getOptionKey={(option: IDropdownOption<number>) => option.value}
					fullWidth
					noOptionsText='Không có khối phù hợp'
					disableClearable
					defaultValue={gradeOptions.find((option) => option.value === selectedGradeId)}
					onChange={(event: any, newValue: IDropdownOption<number> | null) => {
						if (newValue !== null) {
							handleSelectGrade(newValue.value);
						}
					}}
					blurOnSelect
					renderInput={(params) => (
						<TextField {...params} variant='standard' label='Khối' />
					)}
					sx={{ width: '50%' }}
				/>
				<Autocomplete
					options={sessionOptions}
					getOptionLabel={(option: IDropdownOption<string>) => option.label}
					getOptionKey={(option: IDropdownOption<string>) => option.value}
					fullWidth
					noOptionsText='Không có buổi phù hợp'
					disableClearable
					defaultValue={sessionOptions.find(
						(option) => option.value === selectedMainSession
					)}
					onChange={(event, newValue: IDropdownOption<string> | null) => {
						if (newValue !== null) {
							handleSelectSession(newValue.value);
						}
					}}
					blurOnSelect
					renderInput={(params) => (
						<TextField {...params} variant='standard' label='Buổi học' />
					)}
					sx={{ width: '50%' }}
				/>
			</div>
			<div className='w-full h-full mt-[2vh]' onMouseUp={handleMouseUp}>
				<TableContainer
					component={Paper}
					sx={{ userSelect: 'none' }}
					onMouseUp={handleMouseUp}
				>
					<Table aria-label='selectable table' size='small'>
						<TableHead>
							<TableRow>
								<TableCell>STT</TableCell>
								<TableCell>Tên Lớp</TableCell>
								<TableCell>Buổi Học</TableCell>
								<TableCell>Chọn</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isLoading && (
								<TableRow
									style={{
										userSelect: 'none',
										cursor: 'pointer',
									}}
								>
									<TableCell>
										<Skeleton
											variant='text'
											animation='wave'
											sx={{ fontSize: 15 }}
										/>
									</TableCell>
									<TableCell>
										<Skeleton
											variant='text'
											animation='wave'
											sx={{ fontSize: 15 }}
										/>
									</TableCell>
									<TableCell>
										<Skeleton
											variant='text'
											animation='wave'
											sx={{ fontSize: 15 }}
										/>
									</TableCell>
									<TableCell>
										<Checkbox checked={false} disabled />
									</TableCell>
								</TableRow>
							)}
							{classOptions.length === 0 && !isLoading && (
								<TableRow
									style={{
										userSelect: 'none',
									}}
								>
									<TableCell colSpan={4}>
										<h2 className='italic text-body-small opacity-60 w-full text-center py-2'>
											Không có lớp học khả dụng
										</h2>
									</TableCell>
								</TableRow>
							)}
							{classOptions.map((row, index) => (
								<TableRow
									key={index}
									selected={selectedClassIds.includes(row.id)}
									onMouseDown={(event) => handleMouseDown(event, row.id)}
									onMouseEnter={() => handleMouseEnter(row.id)}
									style={{
										backgroundColor: selectedClassIds.includes(row.id)
											? '#f0f0f0'
											: 'inherit',
										userSelect: 'none',
										cursor: 'pointer',
									}}
								>
									<TableCell>{index + 1}</TableCell>
									<TableCell className='font-semibold tracking-wide'>
										{row.name}
									</TableCell>
									<TableCell>{row['main-session-text']}</TableCell>
									<TableCell>
										<Checkbox
											checked={selectedClassIds.includes(row.id)}
											onChange={() => handleSelectRow(row.id)}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default ClassCombinationSelector;
