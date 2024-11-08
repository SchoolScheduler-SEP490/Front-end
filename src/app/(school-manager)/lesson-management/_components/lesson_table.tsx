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
	Typography,
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
import { IDropdownOption } from '../../_utils/contants';
import useUpdateLesson from '../_hooks/useUpdateLesson';
import { ILessonTableData, IUpdateSubjectInGroupRequest } from '../_libs/constants';
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
		disablePadding: true,
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
		label: 'Môn học có tiết cặp',
	},
	{
		id: 'isRequired' as keyof ILessonTableData,
		centered: true,
		disablePadding: false,
		label: 'Môn học chuyên đề',
	},
];
interface EnhancedTableProps {
	rowCount: number;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	return (
		<TableHead>
			<TableRow>
				<TableCell
					rowSpan={2}
					align={headCells[0].centered ? 'center' : 'left'}
					padding={headCells[0].disablePadding ? 'none' : 'normal'}
					width={30}
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
					padding={headCells[headCells.length - 1].disablePadding ? 'none' : 'normal'}
					sx={[
						{
							fontWeight: 'bold',
							borderRight: '1px solid #f0f0f0',
							borderLeft: '1px solid #f0f0f0',
							borderTop: '1px solid #f0f0f0',
						},
					]}
				>
					{headCells[headCells.length - 2].label}
				</TableCell>
				<TableCell
					rowSpan={2}
					align={headCells[headCells.length - 1].centered ? 'center' : 'left'}
					padding={headCells[headCells.length - 1].disablePadding ? 'none' : 'normal'}
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
					<p className='!italic !text-[11px] !font-light opacity-60'>(Chỉ đọc)</p>
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
					Số tiết cặp tối thiểu
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
					Số tiết cặp tối thiểu
				</TableCell>
			</TableRow>
		</TableHead>
	);
}
interface ILessonTableProps {
	subjectTableData: ILessonTableData[];
	termData: IDropdownOption<number>[];
	selectedSubjectGroupId: number;
	mutator: KeyedMutator<any>;
	selectedTermId: number;
	setSelectedTermId: React.Dispatch<React.SetStateAction<number>>;
}
const LessonTable: React.FC<ILessonTableProps> = (props: ILessonTableProps) => {
	const {
		subjectTableData,
		selectedSubjectGroupId,
		mutator,
		termData,
		selectedTermId,
		setSelectedTermId,
	} = props;

	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();

	const [isEditing, setIsEditing] = React.useState<boolean>(false);
	const [editingObjects, setEditingObjects] = React.useState<IUpdateSubjectInGroupRequest[]>([]);
	const [isCancelUpdateModalOpen, setIsCancelUpdateModalOpen] = React.useState<boolean>(false);
	const [isVulnarable, setIsVulnarable] = React.useState<boolean>(false);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const isFilterableOpen = Boolean(anchorEl);
	const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleTermSelect = (event: SelectChangeEvent<number>) => {
		setSelectedTermId(event.target.value as number);
	};

	const isValidInput = (value: IUpdateSubjectInGroupRequest): boolean => {
		if (
			value['sub-slot-per-week'] < 0 ||
			value['main-slot-per-week'] < 0 ||
			value['main-minimum-couple'] < 0 ||
			value['sub-minimum-couple'] < 0
		) {
			useNotify({
				message: 'Số tiết không thể nhỏ hơn 0',
				type: 'error',
			});
			setIsVulnarable(true);
			return false;
		}
		if (
			value['sub-slot-per-week'] > 10 ||
			value['main-slot-per-week'] > 10 ||
			value['main-minimum-couple'] > 10 ||
			value['sub-minimum-couple'] > 10
		) {
			useNotify({
				message: 'Số tiết không thể lớn hơn 10',
				type: 'error',
			});
			setIsVulnarable(true);
			return false;
		}
		setIsVulnarable(false);
		return true;
	};

	const handleUpdateLesson = (
		target: keyof IUpdateSubjectInGroupRequest,
		value: string | boolean,
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
				'main-minimum-couple': row.mainMinimumCouple,
				'sub-minimum-couple': row.subMinimumCouple,
			};
		}
		switch (target) {
			case 'main-slot-per-week':
				if (Number(value) < 0) {
					useNotify({
						message: 'Số tiết không thể nhỏ hơn 0',
						type: 'error',
					});
					break;
				}
				editingObject['main-slot-per-week'] = Number((value as string).replace(/^0+/, ''));
				break;
			case 'is-double-period':
				editingObject['is-double-period'] = value as boolean;
				break;
			case 'sub-slot-per-week':
				if (Number(value) < 0) {
					useNotify({
						message: 'Số tiết không thể nhỏ hơn 0',
						type: 'error',
					});
					break;
				}
				editingObject['sub-slot-per-week'] = Number(value);
				break;
			case 'main-minimum-couple':
				if (Number(value) < 0) {
					useNotify({
						message: 'Số tiết không thể nhỏ hơn 0',
						type: 'error',
					});
					break;
				}
				editingObject['main-minimum-couple'] = Number((value as string).replace(/^0+/, ''));
				break;
			case 'sub-minimum-couple':
				if (Number(value) < 0) {
					useNotify({
						message: 'Số tiết không thể nhỏ hơn 0',
						type: 'error',
					});
					break;
				}
				editingObject['sub-minimum-couple'] = Number(value);
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
			schoolId: Number(schoolId),
			schoolYearId: selectedSchoolYearId,
			termId: selectedTermId,
			subjectGroupId: selectedSubjectGroupId,
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
									<IconButton color='success' onClick={handleConfirmUpdate}>
										<AddTaskIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title='Hủy bỏ'>
									<IconButton onClick={handleConfirmCancelUpdate} color='error'>
										<HighlightOffIcon />
									</IconButton>
								</Tooltip>
							</>
						)}
						<Tooltip title='Lọc danh sách'>
							<IconButton
								id='filter-btn'
								aria-controls={isFilterableOpen ? 'basic-menu' : undefined}
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
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='small'>
						<EnhancedTableHead rowCount={subjectTableData.length} />
						<TableBody>
							{subjectTableData?.length === 0 && (
								<TableRow>
									<TableCell colSpan={8} align='center'>
										<h1 className='text-body-large-strong italic text-basic-gray'>
											Tổ hợp không có dữ liệu
										</h1>
									</TableCell>
								</TableRow>
							)}
							{subjectTableData.map((row, index) => {
								const labelId = `enhanced-table-checkbox-${index}`;
								const editedObject: IUpdateSubjectInGroupRequest | undefined =
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
											width={30}
										>
											{index + 1}
										</TableCell>
										<TableCell
											align='left'
											width={150}
											sx={{
												color: !row.isRequiredSubject ? '#175b8e' : 'black',
											}}
										>
											<Tooltip
												title={
													row.isRequiredSubject
														? 'Môn học bắt buộc'
														: 'Môn học tự chọn'
												}
											>
												<Typography fontSize={15}>
													{row.lessonName}
												</Typography>
											</Tooltip>
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
														event.target.value.replace(/^0+/, ''),
														row
													)
												}
												value={
													!editedObject
														? row.mainTotalSlotPerWeek
														: editedObject['main-slot-per-week']
												}
												id='fullWidth'
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
															transform: 'translateY(-50%)',
															zIndex: 10,
														},
												}}
												onChange={(
													event: React.ChangeEvent<HTMLInputElement>
												) =>
													handleUpdateLesson(
														'main-minimum-couple',
														event.target.value.replace(/^0+/, ''),
														row
													)
												}
												value={
													!editedObject
														? row.mainMinimumCouple
														: editedObject['main-minimum-couple']
												}
												id='fullWidth'
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
														event.target.value.replace(/^0+/, ''),
														row
													)
												}
												value={
													!editedObject
														? row.subTotalSlotPerWeek
														: Number(editedObject['sub-slot-per-week'])
												}
												id='fullWidth'
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
														'sub-minimum-couple',
														event.target.value.replace(/^0+/, ''),
														row
													)
												}
												value={
													!editedObject
														? row.subMinimumCouple
														: Number(editedObject['sub-minimum-couple'])
												}
												id='fullWidth'
											/>
										</TableCell>

										<TableCell align='center' width={50}>
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
											<Checkbox disabled checked={row.isSpecializedSubject} />
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
						Học kỳ
					</InputLabel>
					<Select
						labelId='demo-simple-select-filled-label'
						id='demo-simple-select-filled'
						value={selectedTermId}
						onChange={(event: SelectChangeEvent<number>) => handleTermSelect(event)}
					>
						{termData?.length === 0 && (
							<MenuItem disabled value={0}>
								Không tìm thấy học kỳ
							</MenuItem>
						)}
						{termData?.map((item, index) => (
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
