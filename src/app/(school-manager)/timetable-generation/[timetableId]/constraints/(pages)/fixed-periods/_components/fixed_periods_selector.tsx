import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { TIMETABLE_SLOTS, WEEK_DAYS } from '@/utils/constants';
import ClearIcon from '@mui/icons-material/Clear';
import {
	Button,
	Checkbox,
	Collapse,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
	Typography,
	useTheme,
} from '@mui/material';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { IFilterableDropdownOption } from '../../teacher-unavailability/_libs/constants';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
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

interface ITeacherUnavailableSelectorProps {
	teacherOptions: IFilterableDropdownOption<number>[];
	departmentOptions: IDropdownOption<number>[];
	selectedTeacherIds: number[];
	setSelectedTeacherIds: Dispatch<SetStateAction<number[]>>;
	selectedCells: { [key: string]: { selected: boolean } };
	setSelectedCells: Dispatch<SetStateAction<{ [key: number]: { selected: boolean } }>>;
	handleUpdateResults: () => void;
}

const FixedPeriodsSelector = (props: ITeacherUnavailableSelectorProps) => {
	const {
		teacherOptions,
		selectedTeacherIds,
		setSelectedTeacherIds,
		departmentOptions,
		selectedCells,
		setSelectedCells,
		handleUpdateResults,
	} = props;
	const theme = useTheme();

	const [isSelecting, setIsSelecting] = useState(false);
	const [selectedaDeparmentId, setSelectedDepartmentId] = useState<number>(-1);

	const handleMouseDown = (cellId: number) => {
		if (selectedTeacherIds.length > 0) {
			setIsSelecting(true);
			setSelectedCells((prev) => ({
				...prev,
				[cellId]: { selected: !prev[cellId]?.selected },
			}));
		}
	};

	const filteredData = useMemo(() => {
		setSelectedTeacherIds([]);
		if (selectedaDeparmentId === -1 || selectedaDeparmentId === 0) {
			return teacherOptions;
		}
		return selectedaDeparmentId !== 0
			? teacherOptions.filter((item) => item.filterableId === selectedaDeparmentId)
			: teacherOptions;
	}, [selectedaDeparmentId, teacherOptions]);

	const handleMouseEnter = (cellId: number) => {
		if (isSelecting && selectedTeacherIds.length > 0) {
			setSelectedCells((prev) => {
				const newSelectedCells = { ...prev };

				// Nếu cellId đã tồn tại thì xóa nó khỏi object
				if (cellId in newSelectedCells) {
					delete newSelectedCells[cellId];
				} else {
					// Nếu cellId chưa tồn tại thì thêm vào
					newSelectedCells[cellId] = { selected: true };
				}

				return newSelectedCells;
			});
		}
	};

	const handleMouseUp = () => {
		setIsSelecting(false);
	};

	const handleSelectTeacher = (teacherIds: number[]) => {
		setSelectedTeacherIds(teacherIds);
	};

	const selectedTeachersLabels = useMemo(() => {
		return teacherOptions
			.filter((item) => selectedTeacherIds.includes(item.value))
			.map((item) => item.label)
			.join(', ');
	}, [teacherOptions, selectedTeacherIds]);

	return (
		<div className='w-[50%] h-[90vh] border-r-1 border-basic-gray-active px-[2vw] pt-[5vh] flex flex-col justify-start items-start gap-5'>
			<div
				id='teacher-selector'
				className='w-full h-[5vh] flex flex-row justify-between items-baseline'
			>
				<FormControl sx={{ width: '20%' }}>
					<InputLabel id='teacher-selector-label' variant='standard'>
						Lọc theo TBM
					</InputLabel>
					<Select
						labelId='teacher-selector-label'
						id='teacher-selector-select'
						variant='standard'
						value={selectedaDeparmentId}
						onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
						MenuProps={MenuProps}
						sx={{ width: '100%' }}
						renderValue={(selected) => {
							if (selected === 0) {
								return '  - - -'; // Hiển thị khi chọn giá trị "0"
							}
							const selectedOption = departmentOptions.find(
								(option) => option.value === selected
							);
							return selectedOption ? selectedOption.label : 'Tất cả'; // Hiển thị label tương ứng
						}}
					>
						{departmentOptions.length === 0 ? (
							<MenuItem disabled value={0}>
								Không tìm thấy TBM
							</MenuItem>
						) : (
							<MenuItem value={-1} disabled={departmentOptions.length === 0}>
								<ListItemText primary={'Chọn tất cả'} />
							</MenuItem>
						)}
						{departmentOptions.map((option: IDropdownOption<number>, index: number) => (
							<MenuItem
								key={option.label + index}
								value={option.value}
								style={getStyles(option, teacherOptions, theme)}
							>
								<Checkbox checked={selectedaDeparmentId === option.value} />
								<ListItemText primary={option.label} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl sx={{ width: '40%' }}>
					<InputLabel id='teacher-selector-label' variant='standard'>
						Chọn giáo viên áp dụng
					</InputLabel>
					<Select
						labelId='teacher-selector-label'
						id='teacher-selector-select'
						variant='standard'
						value={selectedTeacherIds}
						multiple
						onChange={(e) => handleSelectTeacher(e.target.value as number[])}
						MenuProps={MenuProps}
						sx={{ width: '100%', maxWidth: '20vw' }}
						renderValue={() => selectedTeachersLabels}
					>
						{filteredData.length === 0 && (
							<MenuItem disabled value={0}>
								Không tìm thấy giáo viên
							</MenuItem>
						)}
						{filteredData.map((option: IDropdownOption<number>, index: number) => (
							<MenuItem
								key={option.label + index}
								value={option.value}
								style={getStyles(option, teacherOptions, theme)}
							>
								<Checkbox checked={selectedTeacherIds.includes(option.value)} />
								<ListItemText primary={option.label} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button
					variant='contained'
					onClick={handleUpdateResults}
					color='inherit'
					disabled={Object.entries(selectedCells).length === 0}
					sx={{
						bgcolor: '#175b8e',
						color: 'white',
						borderRadius: 0,
						width: 150,
						boxShadow: 'none',
					}}
				>
					Lưu thay đổi
				</Button>
			</div>
			<div className='w-full h-fit select-none mt-6'>
				<p className='text-body-small italic opacity-60 my-1 w-full text-ellipsis text-nowrap overflow-hidden'>
					(*) Kéo và chọn các tiết nghỉ/bận của giáo viên để tránh xếp lịch vào các tiết
					đó
				</p>
				<TableContainer component={Paper} sx={{ maxWidth: 900, margin: 'auto' }}>
					<Table onMouseUp={handleMouseUp} size='small' onMouseLeave={handleMouseUp}>
						<TableHead>
							<TableRow>
								<TableCell align='center' sx={{ fontWeight: 'bold', width: 80 }}>
									Buổi
								</TableCell>
								<TableCell align='center' sx={{ fontWeight: 'bold', width: 80 }}>
									Tiết
								</TableCell>
								{WEEK_DAYS.map((day) => (
									<TableCell key={day} align='center' sx={{ fontWeight: 'bold' }}>
										{day}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{TIMETABLE_SLOTS.map((session, sessionIndex) => (
								<>
									{session.slots.map((sessionSlot, slotIndex: number) => (
										<TableRow key={`${session.period}-${slotIndex}`}>
											{slotIndex === 0 && (
												<TableCell
													rowSpan={session.slots.length}
													align='center'
													sx={{
														fontWeight: 'bold',
														border: '1px solid #ddd',
													}}
												>
													{session.period}
												</TableCell>
											)}
											<TableCell align='center'>{sessionSlot}</TableCell>
											{WEEK_DAYS.map((weekday, weekdayIndex: number) => {
												const cellId =
													weekdayIndex * 10 +
													sessionIndex * 5 +
													slotIndex +
													1;
												const isSelected =
													selectedCells[cellId]?.selected || false;
												return (
													<TableCell
														key={cellId}
														align='center'
														sx={{
															backgroundColor: isSelected
																? '#E0E0E0'
																: 'transparent',
															cursor: 'pointer',
															userSelect: 'none',
															border: '1px solid #ddd',
														}}
														onMouseDown={() => handleMouseDown(cellId)}
														onMouseEnter={() =>
															handleMouseEnter(cellId)
														}
													>
														<Collapse in={isSelected} timeout={200}>
															<Typography fontSize={13}>
																<ClearIcon
																	fontSize='small'
																	sx={{ opacity: 0.6 }}
																/>
															</Typography>
														</Collapse>
													</TableCell>
												);
											})}
										</TableRow>
									))}
									{sessionIndex === 0 && (
										<TableRow key={sessionIndex}>
											<TableCell colSpan={WEEK_DAYS.length - 1}></TableCell>
										</TableRow>
									)}
								</>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default FixedPeriodsSelector;
