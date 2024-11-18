import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import { SUBJECT_ABBREVIATION } from '@/utils/constants';
import CloseIcon from '@mui/icons-material/Close';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
	Box,
	Checkbox,
	Collapse,
	Divider,
	FormControl,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Modal,
	Select,
	SelectChangeEvent,
	styled,
	TextField,
	Theme,
	Tooltip,
	tooltipClasses,
	TooltipProps,
	Typography,
	useTheme,
} from '@mui/material';
import Image from 'next/image';
import { ChangeEvent, Dispatch, useEffect, useRef, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { KeyedMutator } from 'swr';
import { IDropdownOption } from '../../_utils/contants';
import useCreateDepartment from '../_hooks/useCreateDepartment';
import useFetchSubjects from '../_hooks/useFetchSubject';
import {
	ICreateDepartmentRequest,
	IErrorDepartmentResonse,
	ISubjectResponse,
	MEETING_DAY_OPTIONS,
} from '../_libs/constants';
import CreateConfirmationModal from './department_modal_confirm';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 11,
	},
}));

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
			width: 200,
			scrollbars: 'none',
		},
	},
};
function getStyles(
	selected: IDropdownOption<number>,
	personName: IDropdownOption<number>[],
	theme: Theme
) {
	return {
		fontWeight: personName.includes(selected)
			? theme.typography.fontWeightMedium
			: theme.typography.fontWeightRegular,
	};
}

const extractInitials = (str: string): string => {
	return str
		.split(' ')
		.map((word) => word[0]?.toUpperCase())
		.join('');
};

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '70vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface RenderSelectedItemOptions {
	item: ICreateDepartmentRequest;
	index: number;
	handleRemoveItem: (item: ICreateDepartmentRequest) => void;
	handleUpdateItem: (
		index: number,
		target: keyof ICreateDepartmentRequest,
		value: string | number
	) => void;
	theme: any;
	errorList: IErrorDepartmentResonse[];
}
function renderSelectedItem({
	item,
	index,
	handleRemoveItem,
	handleUpdateItem,
	theme,
	errorList,
}: RenderSelectedItemOptions) {
	return (
		<ListItem
			secondaryAction={
				<IconButton
					edge='end'
					aria-label='delete'
					color='error'
					title='Delete'
					onClick={() => handleRemoveItem(item)}
				>
					<RemoveCircleOutlineIcon />
				</IconButton>
			}
			sx={[
				{
					cursor: 'pointer',
					userSelect: 'none',
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'baseline',
				},
			]}
		>
			<Typography>{index + 1}</Typography>
			<LightTooltip title={item.name}>
				<TextField
					className='w-[20%]'
					variant='standard'
					label='Tên tổ bộ môn'
					id='name'
					name='name'
					autoFocus
					value={item.name}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						handleUpdateItem(index, 'name', event.target.value)
					}
					error={errorList.find((error) => error.name === item.name) ? true : false}
					slotProps={{
						input: {
							endAdornment: (
								<Image
									className='opacity-30 mx-2 select-none'
									src='/images/icons/text-formatting.png'
									alt='email'
									width={20}
									height={20}
								/>
							),
						},
					}}
				/>
			</LightTooltip>
			<TextField
				className='w-[20%]'
				variant='standard'
				label='Mã tổ bộ môn'
				id='name'
				name='name'
				autoFocus
				value={item['department-code']}
				onChange={(event: ChangeEvent<HTMLInputElement>) =>
					handleUpdateItem(index, 'department-code', event.target.value)
				}
				error={errorList.find((error) => error.name === item.name) ? true : false}
				slotProps={{
					input: {
						endAdornment: (
							<Image
								className='opacity-30 mx-2 select-none'
								src='/images/icons/text-formatting.png'
								alt='email'
								width={20}
								height={20}
							/>
						),
					},
				}}
			/>
			<LightTooltip title={item.description}>
				<TextField
					className='w-[30%]'
					variant='standard'
					label='Mô tả'
					id='name'
					name='name'
					autoFocus
					value={item.description}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						handleUpdateItem(index, 'description', event.target.value)
					}
					slotProps={{
						input: {
							endAdornment: (
								<Image
									className='opacity-30 mx-2 select-none'
									src='/images/icons/text-formatting.png'
									alt='email'
									width={20}
									height={20}
								/>
							),
						},
					}}
				/>
			</LightTooltip>
			<FormControl sx={{ width: '20%' }}>
				<InputLabel id='elective-label' variant='standard'>
					Lịch họp TBM
				</InputLabel>
				<Select
					labelId='elective-label'
					id='elective'
					variant='standard'
					value={item['meeting-day']}
					onChange={(event: SelectChangeEvent<number>) =>
						handleUpdateItem(index, 'meeting-day', Number(event.target.value))
					}
					MenuProps={MenuProps}
					sx={{ width: '100%', height: 32 }}
					// renderValue={(selected) => selected.label}
				>
					{MEETING_DAY_OPTIONS.length === 0 && (
						<MenuItem disabled value={0}>
							Không tìm thấy lịch họp
						</MenuItem>
					)}
					{MEETING_DAY_OPTIONS.map((item, index) => (
						<MenuItem
							key={item.label + index}
							value={item.value}
							style={getStyles(item, MEETING_DAY_OPTIONS, theme)}
						>
							<ListItemText primary={item.label} />
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</ListItem>
	);
}

interface ICreateDepartmentProps {
	open: boolean;
	setOpen: Dispatch<React.SetStateAction<boolean>>;
	updateDepartment: KeyedMutator<any>;
}

const CreateDepartment = (props: ICreateDepartmentProps) => {
	const { selectedSchoolYearId, schoolId, sessionToken } = useAppContext();
	const { open, setOpen, updateDepartment } = props;
	const theme = useTheme();

	const [subjectOptions, setSubjectOptions] = useState<string[]>([]);
	const [editingDepartment, setEditingDepartment] = useState<ICreateDepartmentRequest[]>([]);
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
	const [vulnerableObjects, setVulnerableObjects] = useState<IErrorDepartmentResonse[]>([]);

	const [selectingItems, setSelectingItems] = useState<string[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const listRef = useRef<HTMLDivElement>(null);

	const { data: subjectData, mutate: updateSubject } = useFetchSubjects({
		schoolYearId: selectedSchoolYearId,
		sessionToken,
		pageIndex: 1,
		pageSize: 1000,
	});

	useEffect(() => {
		updateSubject();
		if (subjectData?.status === 200) {
			const tmpSubjectNameArr: string[] = subjectData.result.items.map(
				(subject: ISubjectResponse) => subject['subject-name']
			);
			if (tmpSubjectNameArr.length > 0) {
				setSubjectOptions(tmpSubjectNameArr);
			}
		}
	}, [subjectData, open]);

	const handleAddDepartment = () => {
		const tmpSelectingItems: string[] = [...selectingItems];
		setSelectingItems([]);
		var tmpEditingDepartment: ICreateDepartmentRequest[] = [];
		var subjectGroupStr: string = '';
		var descriptionStr: string = '';
		tmpSelectingItems.map((item: string) => {
			subjectGroupStr += (SUBJECT_ABBREVIATION[item] ?? '') + ' ';
			descriptionStr += item + ' ';
		});
		tmpEditingDepartment.push({
			name: `Tổ ${subjectGroupStr}`,
			'department-code': `T${extractInitials(subjectGroupStr)}`,
			description: `TBM ${descriptionStr}`,
		} as ICreateDepartmentRequest);

		if (tmpEditingDepartment.length > 0) {
			setEditingDepartment((prev: ICreateDepartmentRequest[]) => [
				...prev,
				...tmpEditingDepartment,
			]);
		}
	};

	const handleUpdateDepartment = (
		index: number,
		target: keyof ICreateDepartmentRequest,
		value: string | number
	) => {
		const tmpEditingDepartment: ICreateDepartmentRequest[] = [...editingDepartment];
		(tmpEditingDepartment as any)[index][target] = value;
		setEditingDepartment(tmpEditingDepartment);
	};

	const handleRemoveDepartment = (dep: ICreateDepartmentRequest) => {
		const tmpEditingDepartment: ICreateDepartmentRequest[] = editingDepartment.filter(
			(item) => item.name !== dep.name
		);
		setEditingDepartment(tmpEditingDepartment);
		const recoverSubject = subjectData?.result.items.find(
			(item) => item['subject-name'] === dep.name.replace('Tổ ', '')
		);
		if (recoverSubject) {
			setSubjectOptions([recoverSubject['subject-name'], ...subjectOptions]);
		}
	};

	const handleFormSubmit = async () => {
		const { response } = await useCreateDepartment({
			formData: editingDepartment,
			schoolId: Number(schoolId),
			sessionToken,
		});
		if (response?.status === 200) {
			updateDepartment();
			handleClose();
		} else if (
			response?.status === 400 &&
			response?.message === 'Department name or code does existed.'
		) {
			alert(JSON.stringify(response));
			const tmpErrorObjects: IErrorDepartmentResonse[] = response?.result?.map(
				(item: IErrorDepartmentResonse) => ({
					...item,
				})
			);
			if (tmpErrorObjects.length > 0) {
				setVulnerableObjects(tmpErrorObjects);
			}
		}
	};

	const handleAddSeperateDepartment = () => {
		setEditingDepartment((prev: ICreateDepartmentRequest[]) => [
			{
				name: '',
				'department-code': '',
				description: '',
			} as ICreateDepartmentRequest,
			...prev,
		]);
	};

	const handleSelectAllItems = () => {
		if (selectingItems.length === subjectOptions.length) {
			setSelectingItems([]);
		} else {
			setSelectingItems(subjectOptions);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setEditingDepartment([]);
		setSelectingItems([]);
	};

	const handleMouseDown = (row: string) => {
		setIsDragging(true);
		const updatedSelectedRows = new Set<string>(selectingItems);
		if (updatedSelectedRows.has(row)) {
			updatedSelectedRows.delete(row);
		} else {
			updatedSelectedRows.add(row);
		}
		setSelectingItems(Array.from(updatedSelectedRows));
	};
	const handleMouseUp = () => {
		setIsDragging(false);
	};
	const handleMouseEnter = (row: string) => {
		if (isDragging) {
			const updatedSelectedRows = new Set(selectingItems);
			if (updatedSelectedRows.has(row)) {
				updatedSelectedRows.delete(row);
			} else {
				updatedSelectedRows.add(row);
			}
			setSelectingItems(Array.from(updatedSelectedRows));
		}
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (!isDragging) return;
		const listElement = listRef.current;
		if (listElement) {
			const { top, bottom } = listElement.getBoundingClientRect();

			// Tự động cuộn khi kéo đến rìa
			if (e.clientY < top + 50) {
				listElement.scrollTop -= 5;
			} else if (e.clientY > bottom - 50) {
				listElement.scrollTop += 5;
			}
		}
	};

	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		} else {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging]);

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
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
						Thêm tổ bộ môn
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-[60vh] relative flex flex-row justify-start items-start overflow-hidden'>
					<Box
						ref={listRef}
						sx={{
							width: '20%',
							height: '100%',
							overflowY: 'auto',
							overflowX: 'hidden',
							borderRight: '1px solid #ccc',
							userSelect: 'none',
						}}
						className='overflow-y-scroll no-scrollbar'
					>
						<List>
							<div className='sticky top-0 left-0 !bg-white z-10'>
								<div className='flex flex-row justify-between items-center'>
									<ListItem
										sx={{
											cursor: 'pointer',
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											paddingY: 0,
										}}
										onClick={handleSelectAllItems}
									>
										<ListItemIcon>
											<Checkbox
												checked={
													selectingItems.length === subjectOptions.length
												}
												disabled={subjectOptions.length === 0}
											/>
										</ListItemIcon>
										<ListItemText primary={'Chọn tất cả'} />
									</ListItem>
									<div
										className={`w-fit h-fit mr-2 overflow-visible ${
											selectingItems.length === 0 &&
											'hidden disabled:opacity-0'
										}`}
									>
										<Tooltip title={'Thêm tổ bộ môn với những môn đã chọn'}>
											<IconButton
												color='primary'
												onClick={handleAddDepartment}
											>
												<ControlPointIcon />
											</IconButton>
										</Tooltip>
									</div>
								</div>
								<Divider variant='fullWidth' />
							</div>
							{subjectOptions.length === 0 && (
								<h1 className='text-body-small italic w-full text-center py-2 opacity-80'>
									Không có môn học
								</h1>
							)}
							{subjectOptions.map((item: string, index: number) => (
								<LightTooltip title={item} placement='right'>
									<ListItem
										onMouseDown={() => handleMouseDown(item)}
										onMouseEnter={() => handleMouseEnter(item)}
										key={item + index}
										sx={[
											{
												width: '100%',
												cursor: 'pointer',
												whiteSpace: 'nowrap',
												overflow: 'clip',
												textOverflow: 'ellipsis',
												paddingY: 0,
												paddingRight: 2,
											},
											selectingItems.includes(item) && { bgcolor: '#f5f5f5' },
										]}
									>
										<ListItemIcon>
											<Checkbox checked={selectingItems.includes(item)} />
										</ListItemIcon>
										<ListItemText primary={item} />
									</ListItem>
								</LightTooltip>
							))}
						</List>
					</Box>
					<div className='w-[80%] h-full flex flex-col justify-start items-start'>
						<div className='w-full h-fit p-3 flex flex-row justify-between items-center'>
							<h2 className='text-title-small-strong'>Tổ bộ môn được thêm</h2>
							<Tooltip title={'Thêm tổ bộ môn tự chọn'}>
								<IconButton color='success' onClick={handleAddSeperateDepartment}>
									<ControlPointIcon />
								</IconButton>
							</Tooltip>
						</div>
						<Divider className='w-full' />
						<div className='w-full overflow-y-scroll no-scrollbar'>
							{editingDepartment.length === 0 && (
								<h1 className='text-body-small italic w-full text-center py-2 opacity-80'>
									Chọn môn để thêm tổ bộ môn hoặc thêm tổ bộ môn mới
								</h1>
							)}
							<List sx={{ width: '100%' }}>
								<TransitionGroup className='flex flex-col justify-start items-center'>
									{editingDepartment.map((item, index) => (
										<Collapse key={index} sx={{ width: '98%' }}>
											{renderSelectedItem({
												index,
												item,
												handleRemoveItem: handleRemoveDepartment,
												handleUpdateItem: handleUpdateDepartment,
												theme,
												errorList: vulnerableObjects,
											})}
										</Collapse>
									))}
								</TransitionGroup>
							</List>
						</div>
					</div>
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='Thêm tổ bộ môn'
						disableRipple
						disabled={editingDepartment.length === 0}
						onClick={() => setIsConfirmOpen(true)}
						styles='bg-primary-300 text-white !py-1 px-4'
					/>
				</div>
				<CreateConfirmationModal
					handleConfirm={handleFormSubmit}
					setOpen={setIsConfirmOpen}
					open={isConfirmOpen}
				/>
			</Box>
		</Modal>
	);
};

export default CreateDepartment;
