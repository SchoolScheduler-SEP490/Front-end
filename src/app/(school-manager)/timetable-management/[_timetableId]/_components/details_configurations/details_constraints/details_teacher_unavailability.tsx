import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSMSelector } from '@/hooks/useReduxStore';
import { FC, useEffect, useMemo, useState } from 'react';
import useFetchTeachers from '../../../_hooks/useFetchTeachers';
import { useAppContext } from '@/context/app_provider';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { ITeacherResponse } from '../../../_libs/constants';
import useFilterArray from '@/hooks/useFilterArray';
import {
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
import { INoAssignPeriodObject, TIMETABLE_SLOTS, WEEK_DAYS } from '@/utils/constants';
import ClearIcon from '@mui/icons-material/Clear';

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

interface IFilterableDropdownOption<T> extends IDropdownOption<T> {
	filterableId: number;
}

interface IDetailsTeacherUnavailabilityProps {
	// Add data here
}

const DetailsTeacherUnavailability: FC<IDetailsTeacherUnavailabilityProps> = (props) => {
	const {} = props;
	const { schoolId, sessionToken } = useAppContext();
	const { dataStored }: ITimetableGenerationState = useSMSelector(
		(state) => state.timetableGeneration
	);
	const theme = useTheme();

	const [teacherOptions, setTeacherOptions] = useState<IFilterableDropdownOption<number>[]>([]);
	const [departmentOptions, setDepartmentOptions] = useState<IDropdownOption<number>[]>([]);

	const [selectedTeacherId, setSelectedTeacherId] = useState<number>(0);
	const [selectedaDeparmentId, setSelectedDepartmentId] = useState<number>(0);
	const [selectedCells, setSelectedCells] = useState<{ [key: number]: { selected: boolean } }>({});

	const { data: teacherData, mutate: updateTeacher } = useFetchTeachers({
		schoolId,
		sessionToken,
		pageIndex: 1,
		pageSize: 1000,
	});

	useEffect(() => {
		setTeacherOptions([]);
		updateTeacher();
		if (teacherData?.status === 200 && dataStored) {
			var tmpTeacherOptions: IFilterableDropdownOption<number>[] = [];
			var tmpDepartmentOptions: IDropdownOption<number>[] = [];
			teacherData.result.items
				.filter((teacher: ITeacherResponse) =>
					dataStored['no-assign-periods-para'].some((target) => target['teacher-id'] === teacher.id)
				)
				.map((teacher: ITeacherResponse) => {
					tmpTeacherOptions.push({
						label: `${teacher['first-name']} ${teacher['last-name']} (${teacher.abbreviation})`,
						value: teacher.id,
						filterableId: teacher['department-id'],
					} as IFilterableDropdownOption<number>);

					tmpDepartmentOptions.push({
						label: teacher['department-name'],
						value: teacher['department-id'],
					});
				});
			if (tmpTeacherOptions.length > 0) {
				setTeacherOptions(tmpTeacherOptions);
			}
			if (tmpDepartmentOptions.length > 0) {
				setDepartmentOptions(useFilterArray(tmpDepartmentOptions, ['value']));
			}
		}
	}, [teacherData, dataStored]);

	useEffect(() => {
		if (dataStored) {
			const tmpSelectedCells: { [key: string]: { selected: boolean } } = {};
			dataStored['no-assign-periods-para']
				.filter((teacher: INoAssignPeriodObject) => teacher['teacher-id'] === selectedTeacherId)
				.map((teacher: INoAssignPeriodObject) => {
					tmpSelectedCells[teacher['start-at']] = { selected: true };
				});
			setSelectedCells(tmpSelectedCells);
		}
	}, [selectedTeacherId, dataStored]);

	const filteredData = useMemo(() => {
		setSelectedTeacherId(0);
		if (selectedaDeparmentId === -1 || selectedaDeparmentId === 0) {
			return teacherOptions;
		}
		return selectedaDeparmentId !== 0
			? teacherOptions.filter((item) => item.filterableId === selectedaDeparmentId)
			: teacherOptions;
	}, [selectedaDeparmentId, teacherOptions]);

	const selectedTeachersLabel = useMemo(() => {
		return teacherOptions.find((item) => selectedTeacherId === item.value)?.label;
	}, [teacherOptions, selectedTeacherId]);

	return (
		<div className='w-[100%] h-[90vh] px-[10vw] pt-[5vh]'>
			{dataStored && dataStored['no-assign-periods-para'].length > 0 ? (
				<div className='w-full h-full flex flex-col justify-start items-center gap-5'>
					<div
						id='teacher-selector'
						className='w-full h-[5vh] flex flex-row justify-start items-baseline gap-5'
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
								Chọn giáo viên
							</InputLabel>
							<Select
								labelId='teacher-selector-label'
								id='teacher-selector-select'
								variant='standard'
								value={selectedTeacherId}
								onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
								MenuProps={MenuProps}
								sx={{ width: '100%', maxWidth: '20vw' }}
								renderValue={() => selectedTeachersLabel}
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
										<Checkbox checked={selectedTeacherId === option.value} />
										<ListItemText primary={option.label} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className='w-full h-fit select-none mt-6'>
						<p className='text-body-small italic opacity-60 my-1 w-full text-ellipsis text-nowrap overflow-hidden'>
							(*) Kéo và chọn các tiết nghỉ/bận của giáo viên để tránh xếp lịch vào các tiết đó
						</p>
						<TableContainer component={Paper} sx={{ margin: 'auto' }}>
							<Table size='small'>
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
														const cellId = weekdayIndex * 10 + sessionIndex * 5 + slotIndex + 1;
														const isSelected = selectedCells[cellId]?.selected || false;
														return (
															<TableCell
																key={cellId}
																align='center'
																sx={{
																	backgroundColor: isSelected ? '#E0E0E0' : 'transparent',
																	cursor: 'pointer',
																	userSelect: 'none',
																	border: '1px solid #ddd',
																}}
															>
																<Collapse in={isSelected} timeout={200}>
																	<Typography fontSize={13}>
																		<ClearIcon fontSize='small' sx={{ opacity: 0.6 }} />
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
			) : (
				<div></div>
			)}
		</div>
	);
};

export default DetailsTeacherUnavailability;
