'use client';

import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FilterListIcon from '@mui/icons-material/FilterList';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
	Checkbox,
	FormControl,
	InputLabel,
	Menu,
	MenuItem,
	Select,
	SelectChangeEvent,
	TableHead,
	TextField,
	Toolbar,
	Tooltip,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { KeyedMutator } from 'swr';
import useFetchSchoolYear from '../_hooks/useFetchSchoolYear';
import useUpdateLesson from '../_hooks/useUpdateLesson';
import {
	ILessonTableData,
	ISchoolYearResponse,
	IUpdateSubjectInGroupRequest,
	IYearDropdownOption,
} from '../_libs/constants';
import CancelUpdateLessonModal from './lesson_cancel_modal';

interface IClassGroupData {
	classGroupName: string;
	classes: string[];
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof ILessonTableData;
	label: string;
	centered: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id' as keyof ILessonTableData,
		centered: true,
		disablePadding: false,
		label: 'STT',
	},
	{
		id: 'lessonName' as keyof ILessonTableData,
		centered: false,
		disablePadding: false,
		label: 'Tên',
	},
	{
		id: 'mainSeason' as keyof ILessonTableData,
		centered: true,
		disablePadding: true,
		label: 'Chính khóa',
	},
	{
		id: 'subSeason' as keyof ILessonTableData,
		centered: true,
		disablePadding: false,
		label: 'Trái buổi',
	},
	{
		id: 'doubleAvailability' as keyof ILessonTableData,
		centered: true,
		disablePadding: false,
		label: 'Môn học bắt buộc',
	},
];

interface EnhancedTableProps {
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { rowCount } = props;

	return (
		<TableHead>
			<TableRow>
				<TableCell
					rowSpan={2}
					align={headCells[0].centered ? 'center' : 'left'}
					padding={headCells[0].disablePadding ? 'none' : 'normal'}
					width={50}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					{headCells[0].label}
				</TableCell>
				<TableCell
					rowSpan={2}
					align={headCells[1].centered ? 'center' : 'left'}
					padding={headCells[1].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
						headCells[1].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					{headCells[1].label}
				</TableCell>
				<TableCell
					colSpan={2}
					align={'center'}
					padding={'normal'}
					sx={[
						{
							fontWeight: 'bold',
							paddingLeft: '3%',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					Chính khóa
				</TableCell>
				<TableCell
					colSpan={2}
					align={'center'}
					padding={'normal'}
					sx={[
						{
							fontWeight: 'bold',
							paddingLeft: '3%',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					Trái buổi
				</TableCell>
				<TableCell
					rowSpan={2}
					align={headCells[headCells.length - 1].centered ? 'center' : 'left'}
					padding={
						headCells[headCells.length - 1].disablePadding ? 'none' : 'normal'
					}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					{headCells[headCells.length - 1].label}
					<p className='!italic !text-[11px] !font-light opacity-60'>
						(Chỉ đọc)
					</p>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					align={headCells[3].centered ? 'center' : 'left'}
					padding={headCells[3].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
						headCells[0].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					Tổng số tiết mỗi tuần
				</TableCell>

				<TableCell
					align={headCells[4].centered ? 'center' : 'left'}
					padding={headCells[4].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
						headCells[0].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					Môn học có tiết cặp
				</TableCell>

				<TableCell
					align={headCells[3].centered ? 'center' : 'left'}
					padding={headCells[3].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
						headCells[0].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					Tổng số tiết mỗi tuần
				</TableCell>

				<TableCell
					align={headCells[4].centered ? 'center' : 'left'}
					padding={headCells[4].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
						headCells[0].centered ? { paddingLeft: '3%' } : {},
					]}
				>
					Môn học có tiết cặp
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

interface ILessonTableProps {
	subjectTableData: ILessonTableData[];
	selectedYearId: number;
	setSelectedYearId: React.Dispatch<React.SetStateAction<number>>;
	mutator: KeyedMutator<any>;
}
const LessonTable: React.FC<ILessonTableProps> = (props: ILessonTableProps) => {
	const { subjectTableData, selectedYearId, setSelectedYearId, mutator } = props;
	const { data: yearData, error } = useFetchSchoolYear();
	const { sessionToken } = useAppContext();

	const [yearStudyOptions, setYearStudyOptions] = React.useState<
		IYearDropdownOption<number>[]
	>([]);
	const [isEditing, setIsEditing] = React.useState<boolean>(false);
	const [editingObjects, setEditingObjects] = React.useState<
		IUpdateSubjectInGroupRequest[]
	>([]);
	const [isCancelUpdateModalOpen, setIsCancelUpdateModalOpen] =
		React.useState<boolean>(false);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isFilterableOpen = Boolean(anchorEl);
	const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleYearSelect = (event: SelectChangeEvent<number>) => {
		if (setSelectedYearId) {
			setSelectedYearId(Number(event.target.value));
		}
	};

	React.useEffect(() => {
		if (yearData?.status === 200) {
			const yearStudyOptions: IYearDropdownOption<number>[] = yearData.result.map(
				(item: ISchoolYearResponse) => ({
					value: item.id,
					label: `${item['start-year']} - ${item['end-year']}`,
				})
			);
			setYearStudyOptions(yearStudyOptions);
		}
	}, [yearData]);

	const handleUpdateLesson = (
		target: keyof IUpdateSubjectInGroupRequest,
		value: number | boolean,
		row: ILessonTableData
	) => {
		if (!isEditing) {
			setIsEditing(true);
		}
		var editingObject: IUpdateSubjectInGroupRequest;
		if (editingObjects.some((item) => item['subject-in-group-id'] === row.id)) {
			// Update existing editing data
			editingObject = editingObjects.find(
				(item) => item['subject-in-group-id'] === row.id
			) as IUpdateSubjectInGroupRequest;
		} else {
			// Create new editing data
			editingObject = {
				'subject-in-group-id': row.id,
				'is-double-period': row.isDouleSlot,
				'main-slot-per-week': row.mainTotalSlotPerWeek,
				'sub-slot-per-week': row.subTotalSlotPerWeek,
			};
		}
		switch (target) {
			case 'main-slot-per-week':
				if ((value as number) < 0) {
					useNotify({
						message: 'Số tiết không thể nhỏ hơn 0',
						type: 'error',
					});
					break;
				}
				if ((value as number) > 10) {
					useNotify({
						message: 'Số tiết không thể vượt quá 10',
						type: 'error',
					});
					break;
				}
				if ((value as number) === 0) {
					useNotify({
						message: 'Phải có ít nhất 1 tiết/tuần',
						type: 'error',
					});
					break;
				}
				editingObject['main-slot-per-week'] = value as number;
				break;
			case 'is-double-period':
				editingObject['is-double-period'] = value as boolean;
				break;
			case 'sub-slot-per-week':
				if ((value as number) < 0) {
					useNotify({
						message: 'Số tiết không thể nhỏ hơn 0',
						type: 'error',
					});
					break;
				}
				if ((value as number) > 10) {
					useNotify({
						message: 'Số tiết không thể vượt quá 10',
						type: 'error',
					});
					break;
				}
				if ((value as number) === 0) {
					useNotify({
						message: 'Phải có ít nhất 1 tiết/tuần',
						type: 'error',
					});
					break;
				}
				editingObject['sub-slot-per-week'] = value as number;
				break;
			default:
				break;
		}
		const newEditingObjects = useFilterArray(
			[...editingObjects, editingObject],
			'subject-in-group-id'
		);
		setEditingObjects(newEditingObjects);
	};

	const handleConfirmCancelUpdate = () => {
		setIsCancelUpdateModalOpen(true);
	};

	const handleCancelUpdateLesson = () => {
		setIsEditing(false);
		setEditingObjects([]);
		setIsCancelUpdateModalOpen(false);
	};

	const handleConfirmUpdate = async () => {
		await useUpdateLesson({
			sessionToken: sessionToken,
			formData: editingObjects,
		});
		setIsEditing(false);
		setEditingObjects([]);
		mutator();
	};

	return (
		<Box
			sx={{
				width: '100%',
				paddingTop: '5vh',
				paddingX: '2vw',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
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
					<h2 className='text-title-medium-strong font-semibold w-full text-left'>
						Tiết học
					</h2>
					<div className='h-fit w-fit flex flex-row justify-center items-center gap-2'>
						{isEditing && (
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
						)}
						<Tooltip title='Lọc danh sách'>
							<IconButton
								id='filter-btn'
								aria-controls={
									isFilterableOpen ? 'basic-menu' : undefined
								}
								aria-haspopup='true'
								aria-expanded={isFilterableOpen ? 'true' : undefined}
								onClick={handleFilterClick}
							>
								<FilterListIcon />
							</IconButton>
						</Tooltip>
					</div>
				</Toolbar>
				<TableContainer>
					<Table
						sx={{ minWidth: 750 }}
						aria-labelledby='tableTitle'
						size='small'
					>
						<EnhancedTableHead rowCount={subjectTableData.length} />
						<TableBody>
							{subjectTableData.map((row, index) => {
								const labelId = `enhanced-table-checkbox-${index}`;
								const editedObject:
									| IUpdateSubjectInGroupRequest
									| undefined =
									editingObjects.find(
										(item) => item['subject-in-group-id'] === row.id
									) ?? undefined;

								return (
									<TableRow
										hover
										role='checkbox'
										tabIndex={-1}
										key={row.id}
										sx={[
											{ cursor: 'pointer' },
											editedObject !== undefined && {
												bgcolor: '#fff0eb',
											},
										]}
									>
										<TableCell
											component='th'
											id={labelId}
											scope='row'
											padding='none'
											align='center'
											width={50}
										>
											{index + 1}
										</TableCell>
										<TableCell align='left' width={150}>
											{row.lessonName}
										</TableCell>
										<TableCell align='center' width={100}>
											<TextField
												variant='standard'
												type='number'
												sx={{
													width: '60%',
													'& .MuiInputBase-input': {
														textAlign: 'center',
													},
													'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
														{
															position: 'absolute',
															right: '0',
															top: '50%',
															transform: 'translateY(-50%)',
															zIndex: 10,
														},
												}}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													handleUpdateLesson(
														'main-slot-per-week',
														Number(event.target.value),
														row
													)
												}
												value={
													!editedObject
														? row.mainTotalSlotPerWeek
														: editedObject[
																'main-slot-per-week'
														  ]
												}
												id='fullWidth'
											/>
										</TableCell>
										<TableCell align='center' width={100}>
											<Checkbox
												color='default'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													handleUpdateLesson(
														'is-double-period',
														event.target.checked,
														row
													);
												}}
												checked={
													!editedObject
														? row.isDouleSlot
														: editedObject['is-double-period']
												}
												inputProps={{
													'aria-labelledby': labelId,
												}}
											/>
										</TableCell>
										<TableCell align='center' width={100}>
											<TextField
												variant='standard'
												type='number'
												sx={{
													width: '60%',
													'& .MuiInputBase-input': {
														textAlign: 'center',
													},
													'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
														{
															position: 'absolute',
															right: '0',
															top: '50%',
															zIndex: 10,
														},
												}}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													handleUpdateLesson(
														'sub-slot-per-week',
														Number(event.target.value),
														row
													)
												}
												value={
													!editedObject
														? row.subTotalSlotPerWeek
														: Number(
																editedObject[
																	'sub-slot-per-week'
																]
														  )
												}
												id='fullWidth'
											/>
										</TableCell>
										<TableCell align='center' width={100}>
											<Checkbox
												color='default'
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) => {
													handleUpdateLesson(
														'is-double-period',
														event.target.checked,
														row
													);
												}}
												checked={
													!editedObject
														? row.isDouleSlot
														: editedObject['is-double-period']
												}
												inputProps={{
													'aria-labelledby': labelId,
												}}
											/>
										</TableCell>
										<TableCell width={50} align='center'>
											<Checkbox
												disabled
												checked={row.isRequiredSubject}
											/>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			<Menu
				id='filter-menu'
				anchorEl={anchorEl}
				open={isFilterableOpen}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'filter-btn',
				}}
			>
				<FormControl fullWidth variant='filled' sx={{ p: 1, minWidth: 200 }}>
					<InputLabel
						id='demo-simple-select-filled-label'
						className='!text-body-medium font-normal'
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
			</Menu>
			<CancelUpdateLessonModal
				open={isCancelUpdateModalOpen}
				setOpen={setIsCancelUpdateModalOpen}
				handleApprove={handleCancelUpdateLesson}
			/>
		</Box>
	);
};

export default LessonTable;
