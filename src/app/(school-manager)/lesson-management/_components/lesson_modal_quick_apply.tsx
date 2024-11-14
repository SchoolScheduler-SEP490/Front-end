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
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import {
	ILessonTableData,
	IQuickAssignResponse,
	TermSeperatedAssignedObject,
} from '../_libs/constants';

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

interface IQuickApplyModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	data: TermSeperatedAssignedObject;
}

const LessonQuickApplyModal = (props: IQuickApplyModalProps) => {
	const { open, setOpen, data } = props;
	const [subjectTableData, setSubjectTableData] = useState<ILessonTableData[]>([]);

	const handleClose = () => {
		setOpen(false);
	};

	function Row(props: { rows: IQuickAssignResponse[]; termLabel: string }) {
		const { rows, termLabel } = props;
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
					// const editedObject: IUpdateSubjectInGroupRequest | undefined =
					// 	editingObjects.find(
					// 		(item) => item['subject-in-group-id'] === row.id
					// 	) ?? undefined;
					return (
						<TableRow>
							<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
								<Collapse in={open} timeout='auto' unmountOnExit>
									<TableCell
										component='th'
										id={labelId}
										scope='row'
										padding='normal'
										align='center'
									>
										{index + 1}
									</TableCell>
									<TableCell align='left' width={300}>
										<Typography fontSize={15}>{row['subject-name']}</Typography>
									</TableCell>
									<TableCell align='center'>
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
											// onChange={(event: ChangeEvent<HTMLInputElement>) =>
											// 	handleUpdateLesson(
											// 		'main-slot-per-week',
											// 		event.target.value.replace(/^0+/, ''),
											// 		row
											// 	)
											// }
											// value={
											// 	!editedObject
											// 		? row.mainTotalSlotPerWeek
											// 		: editedObject['main-slot-per-week']
											// }
											value={row['main-slot-per-week']}
											id='fullWidth'
										/>
									</TableCell>
									<TableCell align='center'>
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
											// onChange={(event: ChangeEvent<HTMLInputElement>) =>
											// 	handleUpdateLesson(
											// 		'main-minimum-couple',
											// 		event.target.value.replace(/^0+/, ''),
											// 		row
											// 	)
											// }
											// value={
											// 	!editedObject
											// 		? row.mainMinimumCouple
											// 		: editedObject['main-minimum-couple']
											// }
											value={row['main-minimum-couple']}
											id='fullWidth'
										/>
									</TableCell>

									<TableCell align='center'>
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
											// onChange={(event: ChangeEvent<HTMLInputElement>) =>
											// 	handleUpdateLesson(
											// 		'sub-slot-per-week',
											// 		event.target.value.replace(/^0+/, ''),
											// 		row
											// 	)
											// }
											// value={
											// 	!editedObject
											// 		? row.subTotalSlotPerWeek
											// 		: Number(editedObject['sub-slot-per-week'])
											// }
											value={row['sub-slot-per-week']}
											id='fullWidth'
										/>
									</TableCell>
									<TableCell align='center'>
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
											// onChange={(event: ChangeEvent<HTMLInputElement>) =>
											// 	handleUpdateLesson(
											// 		'sub-minimum-couple',
											// 		event.target.value.replace(/^0+/, ''),
											// 		row
											// 	)
											// }
											// value={
											// 	!editedObject
											// 		? row.subMinimumCouple
											// 		: Number(editedObject['sub-minimum-couple'])
											// }
											value={row['sub-minimum-couple']}
											id='fullWidth'
										/>
									</TableCell>

									<TableCell align='center'>
										<Checkbox
											color='default'
											// onChange={(event: ChangeEvent<HTMLInputElement>) => {
											// 	handleUpdateLesson(
											// 		'is-double-period',
											// 		event.target.checked,
											// 		row
											// 	);
											// }}
											// checked={
											// 	!editedObject
											// 		? row.isDouleSlot
											// 		: editedObject['is-double-period']
											// }
											// inputProps={{
											// 	'aria-labelledby': labelId,
											// }}
											checked={row['is-double-period']}
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
				<div className='w-full h-[60vh] relative flex flex-row justify-start items-start overflow-y-scroll no-scrollbar'>
					<TableContainer>
						<Table
							sx={{ minWidth: 750 }}
							stickyHeader
							aria-label='sticky table'
							size='small'
						>
							<EnhancedTableHead
								totalSlot={
									{
										'main-slot-per-week': 0,
										'sub-slot-per-week': 0,
										'main-minimum-couple': 0,
										'sub-minimum-couple': 0,
									} as ISumObject
								}
							/>
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
									<Row rows={values} termLabel={key} key={key + index} />
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
