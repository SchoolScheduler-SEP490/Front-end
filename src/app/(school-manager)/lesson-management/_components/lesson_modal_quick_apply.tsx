import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
	Box,
	Checkbox,
	CircularProgress,
	circularProgressClasses,
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
import {
	ChangeEvent,
	Dispatch,
	Fragment,
	memo,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from 'react';
import useQuickAssignCurriculumDetails from '../_hooks/useQuickAssign';
import {
	ICurriculumSidenavData,
	ILessonTableData,
	IQuickAssignRequest,
	IQuickAssignResponse,
	TermSeperatedAssignedObject,
} from '../_libs/constants';
import CurriculumApplyModal from './lesson_modal_curriculum_apply';
import { KeyedMutator } from 'swr';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '70vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

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

const EnhancedTableHead = memo(() => {
	return (
		<TableHead sx={{ position: 'sticky', top: 0, left: 0, zIndex: 10 }}>
			<TableRow sx={{ backgroundColor: 'white' }}>
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
							backgroundColor: 'white',
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
							backgroundColor: 'white',
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
							backgroundColor: 'white',
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
							backgroundColor: 'white',
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
							backgroundColor: 'white',
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
							backgroundColor: 'white',
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
							backgroundColor: 'white',
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
							backgroundColor: 'white',
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
							backgroundColor: 'white',
						},
					]}
				>
					Số tiết cặp tối thiểu{' '}
				</TableCell>
			</TableRow>
		</TableHead>
	);
});

interface IQuickApplyModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	data: TermSeperatedAssignedObject;
	isLoading: boolean;
	applicableCurriculum: ICurriculumSidenavData[];
	mutator: KeyedMutator<any>;
}

const LessonQuickApplyModal = (props: IQuickApplyModalProps) => {
	const { open, setOpen, data, isLoading, applicableCurriculum, mutator } = props;
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [editingObjects, setEditingObjects] = useState<IQuickAssignRequest[]>([]);
	const [selectedCurriculumIds, setSelectedCurriculumIds] = useState<number[]>([]);
	const [vulnarableIndexes, setVulnarableIndexes] = useState<number[]>([]);
	const [isApplyCurriculum, setIsApplyCurriculum] = useState<boolean>(false);
	const [expandedTerms, setExpandedTerms] = useState<string[]>([]);

	const handleConfirmQuickApply = async () => {
		setIsApplyCurriculum(false);
		const response = await useQuickAssignCurriculumDetails({
			schoolId: Number(schoolId),
			schoolYearId: selectedSchoolYearId,
			sessionToken,
			formData: {
				'curriculum-apply-ids': selectedCurriculumIds,
				'subject-assignment-configs': editingObjects,
			},
		});
		if (response.status === 200) {
			mutator();
			handleClose();
		}
	};

	const handleClose = () => {
		setOpen(false);
		setEditingObjects([]);
		setVulnarableIndexes([]);
		setIsEditing(false);
		setSelectedCurriculumIds([]);
	};

	const handleToggleExpandTerm = (termId: string) => {
		if (expandedTerms.includes(termId)) {
			setExpandedTerms((prev) => prev.filter((item) => item !== termId));
		} else {
			setExpandedTerms((prev) => [...prev, termId]);
		}
	};

	useEffect(() => {
		if (open) {
			const tmpExpandedTerms: string[] = [];
			Object.entries(data).map(([key]) => {
				tmpExpandedTerms.push(key);
			});
			setExpandedTerms(tmpExpandedTerms);
		}
	}, [open, data]);

	// Validate thông tin người dùng nhập
	useEffect(() => {
		// Kiểm tra điều kiện của từng môn học
		if (editingObjects.length !== 0) {
			editingObjects.map((obj) => {
				if (obj['main-minimum-couple'] > 0 || obj['sub-minimum-couple'] > 0) {
					obj['is-double-period'] = true;
				} else if (obj['main-minimum-couple'] === 0 && obj['sub-minimum-couple'] === 0) {
					obj['is-double-period'] = false;
				}

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
					setVulnarableIndexes((prev) => [
						...prev,
						Number(`${obj['subject-id']}${obj['term-id']}`),
					]);
				} else {
					setVulnarableIndexes((prev) =>
						prev.filter(
							(item) => item !== Number(`${obj['subject-id']}${obj['term-id']}`)
						)
					);
				}
			});
		}
	}, [editingObjects]);

	const updateNumericValue = (
		target: keyof IQuickAssignRequest,
		value: number,
		row: IQuickAssignResponse,
		sumIndex: number
	) => {
		if (value < 0) {
			useNotify({ message: 'Số tiết không thể nhỏ hơn 0', type: 'error' });
			return;
		}

		const editingObject = getEditingObject(row);
		const previousValue = editingObject[target] ?? 0;
		(editingObject as any)[target] = value;

		setEditingObjects(updateEditingObjects(editingObject));
	};

	const handleUpdateLesson = useCallback(
		(
			target: keyof IQuickAssignRequest,
			value: string | boolean,
			row: IQuickAssignResponse,
			sumIndex: number
		) => {
			if (!isEditing) setIsEditing(true);
			if (typeof value === 'string') {
				updateNumericValue(target, Number(value), row, sumIndex);
			} else if (typeof value === 'boolean') {
				const editingObject = getEditingObject(row);
				(editingObject as any)[target] = value;
				setEditingObjects(updateEditingObjects(editingObject));
			}
		},
		[isEditing, editingObjects]
	);
	// Helper functions for clarity
	const getEditingObject = (row: IQuickAssignResponse): IQuickAssignRequest => {
		return (
			editingObjects.find(
				(item) =>
					item['subject-id'] === row['subject-id'] && item['term-id'] === row['term-id']
			) ?? { ...row }
		);
	};

	const updateEditingObjects = (editingObject: IQuickAssignRequest) => {
		return useFilterArray([...editingObjects, editingObject], ['subject-id', 'term-id']);
	};

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
			open={open}
			onClose={handleClose}
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
				{isLoading || Object.entries(data).length === 0 ? (
					<div className='w-full h-[65vh] relative flex flex-row justify-center items-center'>
						<Box sx={{ position: 'relative' }}>
							<CircularProgress
								variant='determinate'
								sx={(theme) => ({
									color: theme.palette.grey[200],
									...theme.applyStyles('dark', {
										color: theme.palette.grey[800],
									}),
								})}
								size={40}
								thickness={4}
								{...props}
								value={100}
							/>
							<CircularProgress
								variant='indeterminate'
								disableShrink
								sx={(theme) => ({
									color: '#004e89',
									animationDuration: '550ms',
									position: 'absolute',
									left: 0,
									[`& .${circularProgressClasses.circle}`]: {
										strokeLinecap: 'round',
									},
									...theme.applyStyles('dark', {
										color: '#308fe8',
									}),
								})}
								size={40}
								thickness={4}
								{...props}
							/>
						</Box>
					</div>
				) : (
					<div className='w-full h-[65vh] relative flex flex-row justify-start items-start overflow-y-scroll no-scrollbar'>
						<TableContainer sx={{ maxHeight: '65vh', overflowY: 'auto' }}>
							<Table
								sx={{ minWidth: 750, position: 'relative' }}
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
										<Fragment key={index}>
											<TableRow
												sx={{
													'& > *': {
														borderBottom: 'unset',
														userSelect: 'none',
														cursor: 'pointer',
													},
													backgroundColor: '#f5f5f5',
												}}
												onClick={() => handleToggleExpandTerm(key)}
											>
												<TableCell colSpan={1} width={50}>
													<IconButton
														aria-label='expand row'
														size='small'
													>
														{expandedTerms.includes(key) ? (
															<KeyboardArrowUpIcon />
														) : (
															<KeyboardArrowDownIcon />
														)}
													</IconButton>
												</TableCell>
												<TableCell colSpan={1} width={280}>
													<Typography fontSize={15} width={280}>
														{key}
													</Typography>
												</TableCell>
												{[1, 2, 3, 4, 5].map((id) => (
													<TableCell
														align='center'
														key={id}
														colSpan={1}
														sx={{
															borderBottom:
																'1px solid rgba(224, 224, 224, 1)', // Hoặc màu mà bạn muốn
														}}
													></TableCell>
												))}
											</TableRow>
											{values.map((row, ind) => {
												const labelId = `enhanced-table-checkbox-${ind}`;
												const editedObject:
													| IQuickAssignRequest
													| undefined =
													editingObjects.find(
														(item) =>
															item['subject-id'] ===
																row['subject-id'] &&
															item['term-id'] === row['term-id']
													) ?? undefined;
												return (
													<TableRow
														sx={[
															{ '& > *': { borderBottom: 'unset' } },
															editedObject !== undefined && {
																bgcolor: vulnarableIndexes.includes(
																	Number(
																		`${editedObject['subject-id']}${editedObject['term-id']}`
																	)
																)
																	? 'rgba(245, 75, 75, .2)'
																	: '#edf1f5',
															},
														]}
													>
														<TableCell
															style={{
																paddingBottom: 0,
																paddingTop: 0,
																paddingLeft: 0,
																paddingRight: 0,
															}}
															colSpan={7}
														>
															<Collapse
																in={expandedTerms.includes(key)}
																timeout='auto'
																unmountOnExit={false}
															>
																<TableCell
																	component='th'
																	id={labelId}
																	scope='row'
																	padding='normal'
																	align='center'
																	width={50}
																>
																	{ind + 1}
																</TableCell>
																<TableCell align='left' width={300}>
																	<Typography
																		fontSize={15}
																		width={300}
																	>
																		{row['subject-name']}
																	</Typography>
																</TableCell>
																<TableCell align='center'>
																	<TextField
																		variant='standard'
																		type='number'
																		onFocus={(event) =>
																			event.target.select()
																		}
																		sx={{
																			width: '60%',
																			'& .MuiInputBase-input':
																				{
																					textAlign:
																						'center',
																				},
																			'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
																				{
																					position:
																						'absolute',
																					right: '0',
																					top: '50%',
																					transform:
																						'translateY(-50%)',
																					zIndex: 10,
																				},
																		}}
																		onChange={(
																			event: ChangeEvent<HTMLInputElement>
																		) =>
																			handleUpdateLesson(
																				'main-slot-per-week',
																				event.target.value.replace(
																					/^0+/,
																					''
																				),
																				row,
																				index
																			)
																		}
																		value={
																			!editedObject
																				? row[
																						'main-slot-per-week'
																				  ]
																				: editedObject[
																						'main-slot-per-week'
																				  ]
																		}
																		id='fullWidth'
																	/>
																</TableCell>
																<TableCell align='center'>
																	<TextField
																		variant='standard'
																		type='number'
																		onFocus={(event) =>
																			event.target.select()
																		}
																		sx={{
																			width: '60%',
																			'& .MuiInputBase-input':
																				{
																					textAlign:
																						'center',
																				},
																			'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
																				{
																					position:
																						'absolute',
																					right: '0',
																					top: '50%',
																					transform:
																						'translateY(-50%)',
																					zIndex: 10,
																				},
																		}}
																		onChange={(
																			event: ChangeEvent<HTMLInputElement>
																		) =>
																			handleUpdateLesson(
																				'main-minimum-couple',
																				event.target.value.replace(
																					/^0+/,
																					''
																				),
																				row,
																				index
																			)
																		}
																		value={
																			!editedObject
																				? row[
																						'main-minimum-couple'
																				  ]
																				: editedObject[
																						'main-minimum-couple'
																				  ]
																		}
																		id='fullWidth'
																	/>
																</TableCell>

																<TableCell align='center'>
																	<TextField
																		variant='standard'
																		type='number'
																		onFocus={(event) =>
																			event.target.select()
																		}
																		sx={{
																			width: '60%',
																			'& .MuiInputBase-input':
																				{
																					textAlign:
																						'center',
																				},
																			'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
																				{
																					position:
																						'absolute',
																					right: '0',
																					top: '50%',
																					zIndex: 10,
																				},
																		}}
																		onChange={(
																			event: ChangeEvent<HTMLInputElement>
																		) =>
																			handleUpdateLesson(
																				'sub-slot-per-week',
																				event.target.value.replace(
																					/^0+/,
																					''
																				),
																				row,
																				index
																			)
																		}
																		value={
																			!editedObject
																				? row[
																						'sub-slot-per-week'
																				  ]
																				: Number(
																						editedObject[
																							'sub-slot-per-week'
																						]
																				  )
																		}
																		id='fullWidth'
																	/>
																</TableCell>
																<TableCell align='center'>
																	<TextField
																		variant='standard'
																		type='number'
																		onFocus={(event) =>
																			event.target.select()
																		}
																		sx={{
																			width: '60%',
																			'& .MuiInputBase-input':
																				{
																					textAlign:
																						'center',
																				},
																			'& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
																				{
																					position:
																						'absolute',
																					right: '0',
																					top: '50%',
																					zIndex: 10,
																				},
																		}}
																		onChange={(
																			event: ChangeEvent<HTMLInputElement>
																		) =>
																			handleUpdateLesson(
																				'sub-minimum-couple',
																				event.target.value.replace(
																					/^0+/,
																					''
																				),
																				row,
																				index
																			)
																		}
																		value={
																			!editedObject
																				? row[
																						'sub-minimum-couple'
																				  ]
																				: Number(
																						editedObject[
																							'sub-minimum-couple'
																						]
																				  )
																		}
																		id='fullWidth'
																	/>
																</TableCell>

																<TableCell
																	align='center'
																	width={100}
																>
																	<Checkbox
																		color='default'
																		onChange={(
																			event: ChangeEvent<HTMLInputElement>
																		) => {
																			handleUpdateLesson(
																				'is-double-period',
																				event.target
																					.checked,
																				row,
																				index
																			);
																		}}
																		checked={
																			!editedObject
																				? row[
																						'is-double-period'
																				  ]
																				: editedObject[
																						'is-double-period'
																				  ]
																		}
																		inputProps={{
																			'aria-labelledby':
																				labelId,
																		}}
																	/>
																</TableCell>
															</Collapse>
														</TableCell>
													</TableRow>
												);
											})}
										</Fragment>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				)}
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='chọn Khung chương trình'
						disableRipple
						disabled={editingObjects.length === 0 || vulnarableIndexes.length !== 0}
						onClick={() => setIsApplyCurriculum(true)}
						styles='bg-primary-300 text-white !py-1 px-4'
					/>
				</div>
				<CurriculumApplyModal
					open={isApplyCurriculum}
					setOpen={setIsApplyCurriculum}
					handleConfirm={handleConfirmQuickApply}
					applicableCurriculum={applicableCurriculum}
					selectedCurriculumIds={selectedCurriculumIds}
					setSelectedCurriculumIds={setSelectedCurriculumIds}
				/>
			</Box>
		</Modal>
	);
};

export default LessonQuickApplyModal;
