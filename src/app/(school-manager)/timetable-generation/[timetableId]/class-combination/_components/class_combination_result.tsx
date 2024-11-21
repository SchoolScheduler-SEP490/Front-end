'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Autocomplete,
	IconButton,
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
import { IExtendedClassCombination } from '../_libs/constants';
import ClassCombinationConfirmModal from './class_combination_modal_confirm';

interface ClassCombinationResultProps {
	classCombinations: IExtendedClassCombination[];
	teacherOptions: IDropdownOption<number>[];
	setTeacherOptions: Dispatch<SetStateAction<IDropdownOption<number>[]>>;
	selectedRow: IExtendedClassCombination | null;
	setSelectedRow: Dispatch<SetStateAction<IExtendedClassCombination | null>>;
	handleAssignTeacher: (teacherId: number) => void;
	handleDeleteClassCombination: () => void;
	isLoading: boolean;
}

const SESSION_TRANSLATOR: { [key: string]: string } = {
	Morning: 'Sáng',
	Afternoon: 'Chiều',
};

const ClassCombinationResult = (props: ClassCombinationResultProps) => {
	const {
		classCombinations,
		teacherOptions,
		setTeacherOptions,
		setSelectedRow,
		handleAssignTeacher,
		handleDeleteClassCombination,
		isLoading,
	} = props;
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

	const handleSelectRow = (row: IExtendedClassCombination) => {
		setSelectedRow(row);
	};

	const handleDeleteButtonClick = (row: IExtendedClassCombination) => {
		setSelectedRow(row);
		setIsConfirmModalOpen(true);
	};

	const handleConfirmDelete = () => {
		handleDeleteClassCombination();
		setIsConfirmModalOpen(false);
	};

	return (
		<div className='w-[60%] h-[100vh] flex flex-col justify-start items-center gap-[2vh] pt-[5vh] px-[1vw] border-r-1 border-basic-gray-active overflow-y-scroll no-scrollbar'>
			<h1 className='w-full text-left text-body-large-strong'>Kết quả</h1>
			<TableContainer component={Paper} style={{ marginTop: '20px', userSelect: 'none' }}>
				<Table aria-label='subject table' size='small'>
					<TableHead>
						<TableRow>
							<TableCell>STT</TableCell>
							<TableCell>Tên Môn Học</TableCell>
							<TableCell>Các Lớp Đã Chọn</TableCell>
							<TableCell>Buổi</TableCell>
							<TableCell>Giáo Viên</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading && (
							<TableRow>
								<TableCell width={50} sx={{ textAlign: 'center' }}>
									<Skeleton
										variant='text'
										animation={'wave'}
										sx={{ width: '100%' }}
									/>
								</TableCell>
								<TableCell sx={{ minWidth: 200, maxWidth: 150 }}>
									<Skeleton
										variant='text'
										animation={'wave'}
										sx={{ width: '100%' }}
									/>
								</TableCell>
								<TableCell>
									<Skeleton
										variant='text'
										animation={'wave'}
										sx={{ width: '100%' }}
									/>
								</TableCell>
								<TableCell width={50}>
									<Skeleton
										variant='text'
										animation={'wave'}
										sx={{ width: '100%' }}
									/>
								</TableCell>
								<TableCell sx={{ minWidth: 200 }}>
									<Skeleton
										variant='text'
										animation={'wave'}
										sx={{ width: '100%' }}
									/>
								</TableCell>
								<TableCell width={50}>
									<IconButton disabled>
										<DeleteIcon color='error' fontSize='small' />
									</IconButton>
								</TableCell>
							</TableRow>
						)}
						{classCombinations.length === 0 && !isLoading && (
							<TableRow
								style={{
									userSelect: 'none',
								}}
							>
								<TableCell colSpan={6}>
									<h2 className='italic text-body-small opacity-60 w-full text-center py-2'>
										Chưa có lớp gộp nào được tạo
									</h2>
								</TableCell>
							</TableRow>
						)}
						{classCombinations.map((row: IExtendedClassCombination, index: number) => (
							<TableRow key={index}>
								<TableCell width={50} sx={{ textAlign: 'center' }}>
									{index + 1}
								</TableCell>
								<TableCell sx={{ minWidth: 200, maxWidth: 150 }}>
									{row['subject-name']}
								</TableCell>
								<TableCell>{row['class-names'].join(' - ')}</TableCell>
								<TableCell width={50}>{SESSION_TRANSLATOR[row.session]}</TableCell>
								<TableCell sx={{ minWidth: 200 }}>
									<Autocomplete
										options={teacherOptions}
										getOptionLabel={(option: IDropdownOption<number>) =>
											option.label
										}
										getOptionKey={(option: IDropdownOption<number>) =>
											option.value
										}
										fullWidth
										noOptionsText='Không có giáo viên phù hợp'
										disableClearable
										defaultValue={row['teacher-name']}
										onOpen={() => {
											handleSelectRow(row);
										}}
										onBlur={() => {
											setTeacherOptions([]);
										}}
										onChange={(
											event: any,
											newValue: IDropdownOption<number> | null
										) => {
											if (newValue !== null) {
												handleAssignTeacher(newValue.value);
											}
										}}
										blurOnSelect
										renderInput={(params) => (
											<TextField {...params} variant='standard' />
										)}
									/>
								</TableCell>
								<TableCell width={50}>
									<IconButton onClick={() => handleDeleteButtonClick(row)}>
										<DeleteIcon color='error' fontSize='small' />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<ClassCombinationConfirmModal
				open={isConfirmModalOpen}
				setOpen={setIsConfirmModalOpen}
				handleConfirmDelete={handleConfirmDelete}
			/>
		</div>
	);
};

export default ClassCombinationResult;
