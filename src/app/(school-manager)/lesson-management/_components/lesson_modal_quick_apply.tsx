import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
	Box,
	Checkbox,
	Collapse,
	IconButton,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { ChangeEvent, Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import {
	ILessonTableData,
	IQuickAssignRequest,
	IQuickAssignResponse,
	IUpdateSubjectInGroupRequest,
	TermSeperatedAssignedObject,
} from '../_libs/constants';
import useNotify from '@/hooks/useNotify';
import useFilterArray from '@/hooks/useFilterArray';
import { Ribeye_Marrow } from 'next/font/google';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '70vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

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

function EnhancedTableHead() {
	return (
		<TableHead sx={{ position: 'sticky', top: 0, left: 0 }}>
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
					width={300}
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
					width={100}
				>
					{headCells[headCells.length - 2].label}
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
					]}
				>
					Tổng số tiết mỗi tuần{' '}
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
					]}
				>
					Số tiết cặp tối thiểu{' '}
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
					]}
				>
					Tổng số tiết mỗi tuần{' '}
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
					]}
				>
					Số tiết cặp tối thiểu{' '}
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

interface IQuickApplyModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	data: TermSeperatedAssignedObject;
}

const LessonQuickApplyModal = (props: IQuickApplyModalProps) => {
	const { open, setOpen, data } = props;
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editingObjects, setEditingObjects] = useState<IQuickAssignRequest[]>([]);
	const [vulnarableIndexes, setVulnarableIndexes] = useState<number[]>([]);
	const [sumObjects, setSumObjects] = useState<ISumObject[]>([]);
	const [isValidTotal, setIsValidTotal] = useState<boolean>(false);

	const handleClose = () => {
		setOpen(false);
	};

	// Validate thông tin người dùng nhập
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
					setVulnarableIndexes((prev) => [...prev, obj['subject-id']]);
				} else {
					setVulnarableIndexes((prev) =>
						prev.filter((item) => item !== obj['subject-id'])
					);
				}
			});

			// Tiết học thì k quá 30 tiết / buổi / tuần
			if (
				sumObjects.findIndex((item) => item['main-slot-per-week'] > 30) > 0 ||
				sumObjects.findIndex((item) => item['sub-slot-per-week'] > 30) > 0
			) {
				useNotify({
					message: 'Tổng số tiết trên tuần không vượt quá 30 tiết',
					type: 'error',
				});
			}

			// Tổng số cặp / buổi / tuần < 12
			if (
				sumObjects.findIndex((item) => item['main-minimum-couple'] > 12) > 0 ||
				sumObjects.findIndex((item) => item['sub-minimum-couple'] > 12) > 0
			) {
				useNotify({
					message: 'Tổng số cặp tối thiểu không vượt quá 12 cặp',
					type: 'error',
				});
			}
			setIsValidTotal(
				!sumObjects.some((item) => item['main-slot-per-week'] > 30) &&
					!sumObjects.some((item) => item['sub-slot-per-week'] > 30) &&
					!sumObjects.some((item) => item['main-minimum-couple'] > 12) &&
					!sumObjects.some((item) => item['sub-minimum-couple'] > 12)
			);
		}
	}, [editingObjects]);

	useEffect(() => {
		if (Object.entries(data).length > 0) {
			var totalSlot: ISumObject[] = [];
			Object.entries(data).map(([key, values]) => {
				var tmpTotal = {
					'main-slot-per-week': 0,
					'sub-slot-per-week': 0,
					'main-minimum-couple': 0,
					'sub-minimum-couple': 0,
				};
				values.forEach((item) => {
					tmpTotal['main-slot-per-week'] += item['main-slot-per-week'];
					tmpTotal['sub-slot-per-week'] += item['sub-slot-per-week'];
					tmpTotal['main-minimum-couple'] += item['main-minimum-couple'];
					tmpTotal['sub-minimum-couple'] += item['sub-minimum-couple'];
				});
				totalSlot.push(tmpTotal);
			});
			setSumObjects(totalSlot);
		}
	}, [data, isEditing]);

	const handleUpdateLesson = (
		target: keyof IQuickAssignRequest,
		value: string | boolean,
		row: IQuickAssignResponse,
		sumIndex: number
	) => {
		if (!isEditing) {
			setIsEditing(true);
		}
		var editingObject: IQuickAssignRequest;
		if (editingObjects.some((item) => item['subject-id'] === row['subject-id'])) {
			// Update existing editing data
			editingObject = editingObjects.find(
				(item) => item['subject-id'] === row['subject-id']
			) as IQuickAssignRequest;
		} else {
			// Create new editing data
			editingObject = { ...row };
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
				const currentSumObjs: ISumObject[] = sumObjects;
				currentSumObjs[sumIndex][target as keyof ISumObject] =
					currentSumObjs[sumIndex][target as keyof ISumObject] -
					previousValue +
					Number(value as string);
				setSumObjects(currentSumObjs);
			}
		} else if (typeof value === 'boolean') {
			(editingObject as any)[target] = value as boolean;
		}
		const newEditingObjects = useFilterArray([...editingObjects, editingObject], 'subject-id');

		setEditingObjects(newEditingObjects);
	};

	function Row(props: { rows: IQuickAssignResponse[]; termLabel: string; labelIndex: number }) {
		const { rows, termLabel, labelIndex } = props;
		const [open, setOpen] = useState(true);

		return (
			<Fragment>
				<TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: '#f5f5f5' }}>
					<TableCell colSpan={1}>
						<IconButton
							aria-label='expand row'
							size='small'
							onClick={() => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
					<TableCell colSpan={7}>{termLabel}</TableCell>
				</TableRow>
				{rows.map((row, index) => {
					const labelId = `enhanced-table-checkbox-${index}`;
					const editedObject: IQuickAssignRequest | undefined =
						editingObjects.find((item) => item['subject-id'] === row['subject-id']) ??
						undefined;
					return (
						<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
							<TableCell
								style={{
									paddingBottom: 0,
									paddingTop: 0,
									paddingLeft: 0,
									paddingRight: 0,
								}}
								colSpan={7}
							>
								<Collapse in={open} timeout='auto' unmountOnExit>
									<TableCell
										component='th'
										id={labelId}
										scope='row'
										padding='normal'
										align='center'
										width={50}
									>
										{index + 1}
									</TableCell>
									<TableCell align='left' width={280}>
										<Typography fontSize={15} width={280}>
											{row['subject-name']}
										</Typography>
									</TableCell>
									<TableCell align='center'>
										<TextField
											variant='standard'
											type='number'
											onFocus={(event) => event.target.select()}
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
													row,
													labelIndex
												)
											}
											value={
												!editedObject
													? row['main-slot-per-week']
													: editedObject['main-slot-per-week']
											}
											id='fullWidth'
										/>
									</TableCell>
									<TableCell align='center'>
										<TextField
											variant='standard'
											type='number'
											onFocus={(event) => event.target.select()}
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
													row,
													labelIndex
												)
											}
											value={
												!editedObject
													? row['main-minimum-couple']
													: editedObject['main-minimum-couple']
											}
											id='fullWidth'
										/>
									</TableCell>

									<TableCell align='center'>
										<TextField
											variant='standard'
											type='number'
											onFocus={(event) => event.target.select()}
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
													row,
													labelIndex
												)
											}
											value={
												!editedObject
													? row['sub-slot-per-week']
													: Number(editedObject['sub-slot-per-week'])
											}
											id='fullWidth'
										/>
									</TableCell>
									<TableCell align='center'>
										<TextField
											variant='standard'
											type='number'
											onFocus={(event) => event.target.select()}
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
													row,
													labelIndex
												)
											}
											value={
												!editedObject
													? row['sub-minimum-couple']
													: Number(editedObject['sub-minimum-couple'])
											}
											id='fullWidth'
										/>
									</TableCell>

									<TableCell align='center' width={100}>
										<Checkbox
											color='default'
											onChange={(event: ChangeEvent<HTMLInputElement>) => {
												handleUpdateLesson(
													'is-double-period',
													event.target.checked,
													row,
													labelIndex
												);
											}}
											checked={
												!editedObject
													? row['is-double-period']
													: editedObject['is-double-period']
											}
											inputProps={{
												'aria-labelledby': labelId,
											}}
										/>
									</TableCell>
								</Collapse>
							</TableCell>
						</TableRow>
					);
				})}
			</Fragment>
		);
	}

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Xếp tiết nhanh
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-[65vh] relative flex flex-row justify-start items-start overflow-y-scroll no-scrollbar'>
					<TableContainer>
						<Table
							sx={{ minWidth: 750 }}
							stickyHeader
							aria-label='sticky table'
							size='small'
						>
							<EnhancedTableHead />
							<TableBody>
								{Object.entries(data)?.length === 0 && (
									<TableRow>
										<TableCell colSpan={10} align='center'>
											<h1 className='text-body-large-strong italic text-basic-gray'>
												Không có dữ liệu môn
											</h1>
										</TableCell>
									</TableRow>
								)}
								{Object.entries(data).map(([key, values], index) => (
									<Row
										rows={values}
										termLabel={key}
										key={key + index}
										labelIndex={index}
									/>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='chọn tổ hợp áp dụng'
						disableRipple
						// disabled={editingDepartment.length === 0}
						// onClick={() => setIsConfirmOpen(true)}
						styles='bg-primary-300 text-white !py-1 px-4'
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default LessonQuickApplyModal;
