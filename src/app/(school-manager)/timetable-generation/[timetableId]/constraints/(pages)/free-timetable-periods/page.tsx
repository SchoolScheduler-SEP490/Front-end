'use client';

import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { IFreePeriodObject } from '@/utils/constants';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import {
	CLASSGROUP_STRING_TYPE,
	CLASSGROUP_TRANSLATOR,
	CLASSGROUP_TRANSLATOR_REVERSED,
	WEEK_DAYS_FULL,
} from '@/utils/constants';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetchClasses from './_hooks/useFetchClass';
import { IClassResponse } from './_libs/constants';
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
	Toolbar,
	Typography,
	useTheme,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { firestore } from '@/utils/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import useNotify from '@/hooks/useNotify';

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
function getStyles<T>(
	selected: IDropdownOption<T>,
	personName: IDropdownOption<T>[],
	theme: Theme
) {
	return {
		fontWeight: personName.includes(selected)
			? theme.typography.fontWeightMedium
			: theme.typography.fontWeightRegular,
	};
}

export default function FreeTimetablePeriods() {
	const { schoolId, sessionToken } = useAppContext();
	const { dataStored, timetableStored, dataFirestoreName }: ITimetableGenerationState =
		useSelector((state: any) => state.timetableGeneration);
	const dispatch = useDispatch();
	const theme = useTheme();

	const [selectedGrade, setSelectedGrade] = useState<string>(CLASSGROUP_TRANSLATOR_REVERSED[10]);
	const [selectedSession, setSelectedSession] = useState<number>(0);
	const [selectedCells, setSelectedCells] = useState<string[]>([]);

	const [gradeOptions, setGradeOptions] = useState<IDropdownOption<string>[]>([]);
	const [sessionOptions, setSessionOptions] = useState<IDropdownOption<number>[]>([]);
	const [classesInGrade, setClassesInGrade] = useState<IDropdownOption<number>[]>([]);
	const [isMouseDown, setIsMouseDown] = useState(false);

	const { data: classData, mutate: updateClass } = useFetchClasses({
		sessionToken,
		schoolId,
		grade: selectedGrade,
		pageIndex: 1,
		pageSize: 1000,
		schoolYearId: timetableStored['year-id'] ?? 0,
	});

	useEffect(() => {
		if (dataStored && dataStored['free-timetable-periods-para']) {
			const tmpResults: string[] = [];
			dataStored['free-timetable-periods-para'].forEach((para) => {
				tmpResults.push(`${para['start-at']}-${para['class-id']}`);
			});
			if (tmpResults.length > 0) {
				setSelectedCells(tmpResults);
			}
		}
	}, [dataStored]);

	useEffect(() => {
		const gradeOptions: IDropdownOption<string>[] = CLASSGROUP_STRING_TYPE.map(
			(option) =>
				({
					label: option.key,
					value: CLASSGROUP_TRANSLATOR_REVERSED[option.value],
				} as IDropdownOption<string>)
		);
		setGradeOptions(gradeOptions);

		const sessionOptions: IDropdownOption<number>[] = [
			{ label: 'Sáng', value: 0 },
			{ label: 'Chiều', value: 1 },
		];
		setSessionOptions(sessionOptions);
	}, []);

	useEffect(() => {
		setClassesInGrade([]);
		updateClass();
		if (classData?.status === 200) {
			const tmpClasses: IDropdownOption<number>[] = classData.result.items.map(
				(clazz: IClassResponse) =>
					({
						label: clazz.name,
						value: clazz.id,
					} as IDropdownOption<number>)
			);

			// Sort classes by length and then alphabetically
			tmpClasses.sort(
				(a, b) =>
					a.label.length - b.label.length ||
					a.label.localeCompare(b.label, undefined, { numeric: true })
			);

			if (tmpClasses.length > 0) {
				setClassesInGrade(tmpClasses);
			}
		}
	}, [classData]);

	const handleMouseDown = (cellId: string) => {
		setIsMouseDown(true);
		toggleCellSelection(cellId);
	};

	const handleMouseEnter = (cellId: string) => {
		if (isMouseDown) {
			toggleCellSelection(cellId);
		}
	};

	const handleMouseUp = () => {
		setIsMouseDown(false);
	};

	const toggleCellSelection = (cellId: string) => {
		if (selectedCells.includes(cellId)) {
			setSelectedCells(selectedCells.filter((cell) => cell !== cellId));
		} else {
			setSelectedCells((prev) => [...prev, cellId]);
		}
	};

	const handleClearData = () => {
		setSelectedCells([]);
		setSelectedGrade(CLASSGROUP_TRANSLATOR_REVERSED[10]);
		setSelectedSession(0);
	};

	const handleUpdateResults = async () => {
		const tmpResults: IFreePeriodObject[] = [];
		selectedCells.forEach((cell) => {
			const [slotId, classId] = cell.split('-');
			tmpResults.push({
				'class-id': Number(classId),
				'start-at': Number(slotId),
			} as IFreePeriodObject);
		});
		if (tmpResults.length > 0) {
			if (dataStored && dataStored.id && dataFirestoreName) {
				const docRef = doc(firestore, dataFirestoreName, dataStored.id);
				await setDoc(
					docRef,
					{ ...dataStored, 'free-timetable-periods-para': tmpResults },
					{ merge: true }
				);
				dispatch(
					updateDataStored({ target: 'free-timetable-periods-para', value: tmpResults })
				);
				useNotify({
					message: 'Cập nhật cấu hình thành công',
					type: 'success',
				});
				handleClearData();
			}
		}
	};

	return (
		<div
			className='w-full h-full max-h-[90vh] flex flex-row justify-center items-start pt-[5vh] overflow-y-scroll no-scrollbar'
			onMouseUp={handleMouseUp}
		>
			<Paper sx={{ width: '95%', mb: 5 }}>
				<Toolbar sx={{ height: 30 }}>
					<div className='w-full flex flex-row justify-start items-baseline gap-5'>
						<FormControl sx={{ width: '10%' }}>
							<InputLabel id='teacher-selector-label' variant='standard'>
								Chọn khối
							</InputLabel>
							<Select
								labelId='periods-selector-label'
								id='periods-selector-select'
								variant='standard'
								value={selectedGrade}
								onChange={(e) => setSelectedGrade(e.target.value)}
								MenuProps={MenuProps}
								sx={{ width: '100%' }}
								renderValue={(selected) =>
									`Khối ${CLASSGROUP_TRANSLATOR[selected]}`
								}
							>
								{gradeOptions.map(
									(option: IDropdownOption<string>, index: number) => (
										<MenuItem
											key={option.label + index}
											value={option.value}
											style={getStyles<string>(option, gradeOptions, theme)}
										>
											<Checkbox checked={selectedGrade === option.value} />
											<ListItemText primary={option.label} />
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
						<FormControl sx={{ width: '10%' }}>
							<InputLabel id='teacher-selector-label' variant='standard'>
								Chọn buổi
							</InputLabel>
							<Select
								labelId='sessions-selector-label'
								id='sessions-selector-select'
								variant='standard'
								value={selectedSession}
								onChange={(e) => setSelectedSession(Number(e.target.value))}
								MenuProps={MenuProps}
								sx={{ width: '100%' }}
								renderValue={(selected) => (selected === 0 ? 'Sáng' : 'Chiều')}
							>
								{sessionOptions.map(
									(option: IDropdownOption<number>, index: number) => (
										<MenuItem
											key={option.label + index}
											value={option.value}
											style={getStyles<number>(option, sessionOptions, theme)}
										>
											<Checkbox checked={selectedSession === option.value} />
											<ListItemText primary={option.label} />
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
					</div>
					<Button
						variant='contained'
						onClick={handleUpdateResults}
						color='inherit'
						disabled={selectedCells.length === 0}
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
				</Toolbar>
				<TableContainer>
					<Table size='small'>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>
									Thứ
								</TableCell>
								<TableCell sx={{ fontWeight: 'bold', border: '1px solid #ddd' }}>
									Tiết
								</TableCell>
								{classesInGrade.map((clazz, index) => (
									<TableCell
										key={index}
										sx={{
											fontWeight: 'bold',
											textAlign: 'center',
											border: '1px solid #ddd',
										}}
									>
										{clazz.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{WEEK_DAYS_FULL.map((day: string, weekdayIndex: number) => (
								<>
									{[1, 2, 3, 4, 5].map((slotIndex) => (
										<TableRow key={`${weekdayIndex}-${slotIndex}`}>
											{slotIndex === 1 && (
												<TableCell
													rowSpan={5}
													width={30}
													sx={{
														textAlign: 'center',
														fontWeight: 'bold',
														border: '1px solid #ddd',
													}}
												>
													{day}
												</TableCell>
											)}
											<TableCell
												sx={{
													textAlign: 'center',
													fontWeight: 'bold',
													border: '1px solid #ddd',
												}}
												className={
													selectedSession === 0
														? '!text-primary-400'
														: '!text-tertiary-normal'
												}
												width={30}
											>
												{slotIndex + selectedSession * 5}
											</TableCell>
											{classesInGrade.map((clazz) => {
												const cellId = `${
													weekdayIndex * 10 +
													selectedSession * 5 +
													slotIndex
												}-${clazz.value}`;
												const isSelected =
													selectedCells.includes(cellId) || false;
												return (
													<TableCell
														key={cellId}
														id={cellId}
														onMouseDown={() => handleMouseDown(cellId)}
														onMouseEnter={() =>
															handleMouseEnter(cellId)
														}
														sx={{
															border: '1px solid #ddd',
															userSelect: 'none',
															cursor: 'pointer',
															textAlign: 'center',
															backgroundColor: isSelected
																? '#e7e7e7'
																: 'transparent',
														}}
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
								</>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
}
