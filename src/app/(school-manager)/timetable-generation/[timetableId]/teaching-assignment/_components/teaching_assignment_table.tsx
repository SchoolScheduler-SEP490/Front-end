'use client';

import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FilterListIcon from '@mui/icons-material/FilterList';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Autocomplete, TextField, Toolbar, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import useAssignTeacher from '../_hooks/useAssignTeacher';
import useFetchTeachableTeacher from '../_hooks/useFetchTeachableTeacher';
import {
	ITeachableResponse,
	ITeacherAssignmentRequest,
	ITeachingAssignmentTableData,
} from '../_libs/constants';
import CancelAssignTeacherModal from './teaching_assignment_modal_cancel';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import { useDispatch, useSelector } from 'react-redux';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebaseConfig';
import { IConfigurationStoreObject, ITeachingAssignmentObject } from '@/utils/constants';

interface HeadCell {
	disablePadding: boolean;
	id: keyof ITeachingAssignmentTableData;
	label: string;
	centered: boolean;
}
const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ITeachingAssignmentTableData,
		centered: false,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'subjectName' as keyof ITeachingAssignmentTableData,
		centered: false,
		disablePadding: false,
		label: 'Môn học',
	},
	{
		id: 'teacherName' as keyof ITeachingAssignmentTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên giáo viên',
	},
	{
		id: 'totalSlotPerWeek' as keyof ITeachingAssignmentTableData,
		centered: true,
		disablePadding: true,
		label: 'Số tiết/tuần',
	},
];
function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.centered ? 'center' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sx={[
							{ fontWeight: 'bold' },
							headCell.centered ? { paddingLeft: '3%' } : {},
						]}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface ITeachingAssignmentTableProps {
	subjectData: ITeachingAssignmentTableData[];
	mutate: KeyedMutator<any>;
	isFilterable: boolean;
	setIsFilterable: React.Dispatch<React.SetStateAction<boolean>>;
	selectedCurriculumName: string;
	editingObjects: ITeacherAssignmentRequest[];
	setEditingObjects: React.Dispatch<React.SetStateAction<ITeacherAssignmentRequest[]>>;
	selectedGrade: string;
}

const TeachingAssignmentTable = (props: ITeachingAssignmentTableProps) => {
	const {
		subjectData,
		mutate,
		isFilterable,
		setIsFilterable,
		selectedCurriculumName,
		editingObjects,
		setEditingObjects,
		selectedGrade,
	} = props;
	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
	const { dataStored, dataFirestoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useDispatch();

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [teachableDropdown, setTeachableDropdown] = useState<IDropdownOption<number>[]>([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState<number>(
		subjectData[0]?.subjectKey ?? 0
	);
	const [isCancelUpdateModalOpen, setIsCancelUpdateModalOpen] = useState<boolean>(false);
	const { data: teachableData, mutate: getTeachableData } = useFetchTeachableTeacher({
		schoolId: Number(schoolId),
		subjectId: selectedSubjectId,
		sessionToken,
		grade: selectedGrade,
	});

	useEffect(() => {
		if (teachableData?.status === 200) {
			const dropdownOptions: IDropdownOption<number>[] = teachableData.result.map(
				(item: ITeachableResponse) => {
					return {
						value: item['teacher-id'],
						label: `${item['teacher-name']} (${item['teacher-abreviation']})`,
					} as IDropdownOption<number>;
				}
			);
			setTeachableDropdown([...useFilterArray(dropdownOptions, ['value'])]);
		}
	}, [teachableData, selectedSubjectId]);

	const handleFilterable = () => {
		setIsFilterable(!isFilterable);
	};

	const handleConfirmCancelUpdate = () => {
		setIsCancelUpdateModalOpen(true);
	};

	const handleCancelUpdateTeachingAssignment = () => {
		setIsEditing(false);
		setEditingObjects([]);
		setIsCancelUpdateModalOpen(false);
		mutate();
	};

	const handleConfirmUpdate = async () => {
		if (dataStored && dataStored.id && dataFirestoreName) {
			const newResult: ITeachingAssignmentObject[] = [
				...dataStored['teacher-assignments'],
				...editingObjects,
			];
			const docRef = doc(firestore, dataFirestoreName, dataStored.id);
			await setDoc(
				docRef,
				{
					...dataStored,
					'teacher-assignments': newResult,
				} as IConfigurationStoreObject,
				{ merge: true }
			);
			dispatch(updateDataStored({ target: 'teacher-assignments', value: newResult }));
			setIsEditing(false);
			setEditingObjects([]);
		}
	};

	const handleAssignTeacher = (assignmentId: number, selectedTeacherId: number) => {
		setIsEditing(true);
		var editingObject: ITeacherAssignmentRequest | undefined = editingObjects.find(
			(item) => item['assignment-id'] === assignmentId
		);
		if (!editingObject) {
			editingObject = {
				'assignment-id': assignmentId,
				'teacher-id': selectedTeacherId ?? 0,
			};
		} else {
			editingObject['teacher-id'] = selectedTeacherId;
		}
		setEditingObjects(useFilterArray([...editingObjects, editingObject], ['assignment-id']));
	};

	const handleSelectSubject = (subjectId: number) => {
		setSelectedSubjectId(subjectId);
		getTeachableData({ subjectId: selectedSubjectId });
	};

	return (
		<div className='relative w-[65%] h-fit max-h-[85vh] flex flex-row justify-center items-start pt-[4vh] px-1 overflow-y-scroll no-scrollbar'>
			<Box sx={{ width: '100%' }}>
				<Paper sx={{ width: '100%', mb: 2 }}>
					<Toolbar
						sx={[
							{
								pl: { sm: 2 },
								pr: { xs: 1, sm: 1 },
								width: '100%',
							},
							isEditing && {
								bgcolor: '#e8f0f5',
							},
						]}
					>
						<div className='w-full flex flex-col justify-start items-start'>
							<h2 className='text-title-medium-strong font-semibold w-full text-left'>
								Phân công giảng dạy
							</h2>
							<h3 className='w-full flex flex-row justify-start items-baseline gap-2 text-body-small'>
								Khung chương trình:
								<p className='text-body-small font-medium text-primary-500'>
									{selectedCurriculumName}
								</p>
							</h3>
						</div>
						<div className='h-fit w-fit flex flex-row justify-center items-center gap-2'>
							{
								isEditing && (
									<>
										<Tooltip title='Lưu thay đổi'>
											<IconButton
												color='success'
												onClick={handleConfirmUpdate}
											>
												<AddTaskIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title='Hủy bỏ'>
											<IconButton
												onClick={handleConfirmCancelUpdate}
												color='error'
											>
												<HighlightOffIcon />
											</IconButton>
										</Tooltip>
									</>
								)
								// <Tooltip title='Phân công tự động'>
								// 	<IconButton
								// 		id='filter-btn'
								// 		aria-controls={isFilterable ? 'basic-menu' : undefined}
								// 		aria-haspopup='true'
								// 		aria-expanded={isFilterable ? 'true' : undefined}
								// 		onClick={handleAutoAssign}
								// 	>
								// 		<LayersIcon fontSize='medium' />
								// 	</IconButton>
								// </Tooltip>
							}
							<Tooltip title='Lọc danh sách'>
								<IconButton
									id='filter-btn'
									aria-controls={isFilterable ? 'basic-menu' : undefined}
									aria-haspopup='true'
									aria-expanded={isFilterable ? 'true' : undefined}
									onClick={handleFilterable}
								>
									<FilterListIcon />
								</IconButton>
							</Tooltip>
						</div>
					</Toolbar>
					<TableContainer>
						<Table aria-labelledby='tableTitle' size='small'>
							<EnhancedTableHead />
							<TableBody>
								{subjectData.length === 0 && (
									<TableRow>
										<TableCell colSpan={4} align='center'>
											<h1 className='text-body-large-strong italic text-basic-gray'>
												Lớp học chưa áp dụng Khung chương trình
											</h1>
										</TableCell>
									</TableRow>
								)}
								{subjectData.map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`;
									const editedObject: ITeacherAssignmentRequest | undefined =
										editingObjects.find(
											(item) => item['assignment-id'] === row.id
										) ?? undefined;

									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={row.id}
											sx={[
												{ cursor: 'pointer', userSelect: 'none' },
												editedObject !== undefined && {
													bgcolor: '#e6edf3',
												},
											]}
										>
											<TableCell
												component='th'
												id={labelId}
												width={50}
												scope='row'
												padding='normal'
												align='center'
											>
												{index + 1}
											</TableCell>
											<TableCell
												align='left'
												width={100}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{row.subjectName}
											</TableCell>
											<TableCell
												align='left'
												width={250}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												<Autocomplete
													options={teachableDropdown}
													getOptionLabel={(
														option: IDropdownOption<number>
													) => option.label}
													getOptionKey={(
														option: IDropdownOption<number>
													) => option.value}
													fullWidth
													noOptionsText='Không có giáo viên phù hợp'
													disableClearable
													defaultValue={row.teacherName}
													onOpen={() => {
														handleSelectSubject(row.subjectKey);
													}}
													onBlur={() => {
														setTeachableDropdown([]);
													}}
													onChange={(
														event: any,
														newValue: IDropdownOption<number> | null
													) => {
														if (newValue !== null) {
															handleAssignTeacher(
																row.id,
																newValue.value
															);
														}
													}}
													blurOnSelect
													renderInput={(params) => (
														<TextField {...params} variant='standard' />
													)}
												/>
											</TableCell>
											<TableCell
												align='center'
												width={80}
												sx={{
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{row.totalSlotPerWeek}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			</Box>
			<CancelAssignTeacherModal
				open={isCancelUpdateModalOpen}
				setOpen={setIsCancelUpdateModalOpen}
				handleApprove={handleCancelUpdateTeachingAssignment}
			/>
		</div>
	);
};

export default TeachingAssignmentTable;
