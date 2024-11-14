'use client';

import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import AddTaskIcon from '@mui/icons-material/AddTask';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
	Button,
	Checkbox,
	Menu,
	MenuItem,
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
import { ChangeEvent, Dispatch, FC, MouseEvent, SetStateAction, useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import { IDropdownOption } from '../../_utils/contants';
import useUpdateLesson from '../_hooks/useUpdateLesson';
import { ILessonTableData, IUpdateSubjectInGroupRequest } from '../_libs/constants';
import CancelUpdateLessonModal from './lesson_modal_cancel';

interface ISumObject {
	'main-slot-per-week': number;
	'sub-slot-per-week': number;
	'main-minimum-couple': number;
	'sub-minimum-couple': number;
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
	totalSlot: ISumObject;
}
function EnhancedTableHead(props: EnhancedTableProps) {
	const { totalSlot } = props;
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
					Tổng số tiết mỗi tuần{' '}
					<Typography
						fontSize={12}
						fontStyle={'normal'}
						color={totalSlot?.['main-slot-per-week'] > 30 ? 'error' : 'black'}
					>
						({totalSlot?.['main-slot-per-week'] ?? 0})
					</Typography>
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
					Số tiết cặp tối thiểu{' '}
					<Typography
						fontSize={12}
						fontStyle={'normal'}
						color={totalSlot?.['main-minimum-couple'] > 12 ? 'error' : 'black'}
					>
						({totalSlot?.['main-minimum-couple'] ?? 0})
					</Typography>
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
					Tổng số tiết mỗi tuần{' '}
					<Typography
						fontSize={12}
						fontStyle={'normal'}
						color={totalSlot?.['sub-slot-per-week'] > 30 ? 'error' : 'black'}
					>
						({totalSlot?.['sub-slot-per-week'] ?? 0})
					</Typography>
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
					Số tiết cặp tối thiểu{' '}
					<Typography
						fontSize={12}
						fontStyle={'normal'}
						color={totalSlot?.['sub-minimum-couple'] > 12 ? 'error' : 'black'}
					>
						({totalSlot?.['sub-minimum-couple'] ?? 0})
					</Typography>
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
	setSelectedTermId: Dispatch<SetStateAction<number>>;
	isQuickAssignmentApplied: boolean;
	setQuickAssignmentApplied: Dispatch<SetStateAction<boolean>>;
	toggleQuickApply: KeyedMutator<any>;
}
const LessonTable: FC<ILessonTableProps> = (props: ILessonTableProps) => {
	const {
		subjectTableData,
		selectedSubjectGroupId,
		mutator,
		termData,
		selectedTermId,
		setSelectedTermId,
		isQuickAssignmentApplied,
		setQuickAssignmentApplied,
		toggleQuickApply,
	} = props;

	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();

	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editingObjects, setEditingObjects] = useState<IUpdateSubjectInGroupRequest[]>([]);
	const [isCancelUpdateModalOpen, setIsCancelUpdateModalOpen] = useState<boolean>(false);
	const [vulnarableIndexes, setVulnarableIndexes] = useState<number[]>([]);
	const [sumObject, setSumObject] = useState<ISumObject>({
		'main-slot-per-week': 0,
		'sub-slot-per-week': 0,
		'main-minimum-couple': 0,
		'sub-minimum-couple': 0,
	});
	const [isValidTotal, setIsValidTotal] = useState<boolean>(false);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isFilterableOpen = Boolean(anchorEl);
	const handleFilterClick = (event: MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleTermSelect = (termId: number) => {
		setSelectedTermId(termId);
	};

	useEffect(() => {
		// Kiểm tra điều kiện của từng môn học
		if (editingObjects.length !== 0) {
			editingObjects.map((obj) => {
				var isVulnerableObj = false;
				// Nào có tiết đôi thì minimum couple k để trống
				if (obj['is-double-period']) {
					if (obj['main-minimum-couple'] === 0 && obj['sub-minimum-couple'] === 0) {
						isVulnerableObj = true;
						useNotify({
							message: 'Môn học có tiết cặp cần có ít nhất 1 tiết cặp tối thiểu',
							type: 'error',
						});
					}
				}

				// Số cặp tối thiểu < số tiết trên tuần /2
				if (
					obj['main-minimum-couple'] > obj['main-slot-per-week'] / 2 ||
					obj['sub-minimum-couple'] > obj['sub-slot-per-week'] / 2
				) {
					isVulnerableObj = true;
					useNotify({
						message: 'Số tiết cặp tối thiểu không vượt quá nửa số tiết mỗi tuần',
						type: 'error',
					});
				}

				// Số tiết trên tuần không vượt quá 10 tiết
				if (obj['main-slot-per-week'] > 10 || obj['sub-slot-per-week'] > 10) {
					isVulnerableObj = true;

					useNotify({
						message: 'Số tiết trên tuần không vượt quá 10 tiết',
						type: 'error',
					});
				}

				if (isVulnerableObj) {
					setVulnarableIndexes((prev) => [...prev, obj['subject-in-group-id']]);
				} else {
					setVulnarableIndexes((prev) =>
						prev.filter((item) => item !== obj['subject-in-group-id'])
					);
				}
			});

			// Tiết học thì k quá 30 tiết / buổi / tuần
			if (sumObject['main-slot-per-week'] > 30 || sumObject['sub-slot-per-week'] > 30) {
				useNotify({
					message: 'Tổng số tiết trên tuần không vượt quá 30 tiết',
					type: 'error',
				});
			}

			// Tổng số cặp / buổi / tuần < 12
			if (sumObject['main-minimum-couple'] > 12 || sumObject['sub-minimum-couple'] > 12) {
				useNotify({
					message: 'Tổng số cặp tối thiểu không vượt quá 12 cặp',
					type: 'error',
				});
			}
			setIsValidTotal(
				!(sumObject['main-slot-per-week'] > 30) &&
					!(sumObject['sub-slot-per-week'] > 30) &&
					!(sumObject['main-minimum-couple'] > 12) &&
					!(sumObject['sub-minimum-couple'] > 12)
			);
		}
	}, [editingObjects]);

	useEffect(() => {
		if (subjectTableData.length > 0) {
			var totalSlot: ISumObject = {
				'main-slot-per-week': 0,
				'sub-slot-per-week': 0,
				'main-minimum-couple': 0,
				'sub-minimum-couple': 0,
			};
			subjectTableData.map((item) => {
				totalSlot['main-slot-per-week'] += item.mainTotalSlotPerWeek;
				totalSlot['sub-slot-per-week'] += item.subTotalSlotPerWeek;
				totalSlot['main-minimum-couple'] += item.mainMinimumCouple;
				totalSlot['sub-minimum-couple'] += item.subMinimumCouple;
			});
			setSumObject(totalSlot);
		}
	}, [subjectTableData, isEditing]);

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

		// Assign data
		if (typeof value === 'string') {
			if (Number(value) < 0) {
				useNotify({
					message: 'Số tiết không thể nhỏ hơn 0',
					type: 'error',
				});
			} else {
				// Lưu giá trị cũ của editingObject vào một biến tạm
				const previousValue = (editingObject as any)[target] ?? 0;

				// Cập nhật giá trị mới cho editingObject
				(editingObject as any)[target] = Number(value as string);

				// Cập nhật sum dựa trên giá trị cũ của editingObject
				setSumObject((prev: ISumObject) => ({
					...prev,
					[target]:
						((prev as any)[target] ?? 0) + Number(value as string) - previousValue,
				}));
			}
		} else if (typeof value === 'boolean') {
			(editingObject as any)[target] = value as boolean;
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
		setVulnarableIndexes([]);
		mutator();
	};

	const handleQuickAssign = () => {
		setQuickAssignmentApplied(true);
		if (isQuickAssignmentApplied) {
			toggleQuickApply();
		}
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
					<div className='w-full flex flex-row justify-start items-baseline'>
						<h2 className='text-title-medium-strong font-semibold w-[15%] text-left'>
							Tiết học
						</h2>
						<div
							className='text-body-medium-strong font-normal leading-4 opacity-80 flex flex-row justify-between items-center cursor-pointer'
							id='basic-button'
							aria-controls={isFilterableOpen ? 'basic-menu' : undefined}
							aria-haspopup='true'
							aria-expanded={isFilterableOpen ? 'true' : undefined}
							onClick={handleFilterClick}
						>
							{termData.find((item) => item.value === selectedTermId)?.label ??
								'Không tìm thấy học kỳ'}
							<KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
						</div>
						<Menu
							id='basic-menu'
							anchorEl={anchorEl}
							open={isFilterableOpen}
							onClose={handleClose}
							MenuListProps={{
								'aria-labelledby': 'basic-button',
							}}
						>
							{termData?.length === 0 && (
								<MenuItem disabled value={0}>
									Không tìm thấy học kỳ
								</MenuItem>
							)}
							{termData?.map((item, index) => (
								<MenuItem
									key={item.value + index}
									value={item.value}
									onClick={() => handleTermSelect(item.value)}
								>
									{item.label}
								</MenuItem>
							))}
						</Menu>
					</div>
					<div className='h-fit w-fit flex flex-row justify-center items-center gap-2 pr-2'>
						{isEditing && (
							<>
								<Tooltip
									title={
										vulnarableIndexes.length > 0 && isValidTotal
											? 'Sửa lỗi trước khi lưu thay đổi'
											: 'Lưu thay đổi'
									}
								>
									<IconButton
										color='success'
										onClick={handleConfirmUpdate}
										disabled={!isValidTotal || vulnarableIndexes.length > 0}
									>
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
						<Button
							variant='contained'
							onClick={handleQuickAssign}
							color='inherit'
							sx={{
								bgcolor: '#175b8e',
								color: 'white',
								borderRadius: 0,
								width: 150,
								boxShadow: 'none',
							}}
						>
							xếp tiết nhanh
						</Button>
					</div>
				</Toolbar>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle' size='small'>
						<EnhancedTableHead totalSlot={sumObject} />
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
												bgcolor: vulnarableIndexes.includes(
													editedObject['subject-in-group-id']
												)
													? 'rgba(245, 75, 75, .2)'
													: '#edf1f5',
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
												onChange={(event: ChangeEvent<HTMLInputElement>) =>
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
												onChange={(event: ChangeEvent<HTMLInputElement>) =>
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
												onChange={(event: ChangeEvent<HTMLInputElement>) =>
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
												onChange={(event: ChangeEvent<HTMLInputElement>) =>
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
													event: ChangeEvent<HTMLInputElement>
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
			<CancelUpdateLessonModal
				open={isCancelUpdateModalOpen}
				setOpen={setIsCancelUpdateModalOpen}
				handleApprove={handleCancelUpdateLesson}
			/>
		</Box>
	);
};

export default LessonTable;
