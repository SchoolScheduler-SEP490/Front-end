'use client';

import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import useNotify from '@/hooks/useNotify';
import {
	CLASSGROUP_STRING_TYPE,
	CLASSGROUP_TRANSLATOR,
	CLASSGROUP_TRANSLATOR_REVERSED,
	IFreePeriodObject,
	WEEK_DAYS_FULL,
} from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
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
	Toolbar,
	Typography,
	useTheme,
} from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetchClasses from '../../../_hooks/useFetchClasses';
import { IClassResponse } from '../../../_libs/constants';

interface IAvailableEmptySlots {
	[key: string]: number;
}

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

const DetailsFreeTimetablePeriod = () => {
    const { schoolId, sessionToken } = useAppContext();
	const { dataStored, timetableStored, dataFirestoreName }: ITimetableGenerationState =
		useSelector((state: any) => state.timetableGeneration);
	const dispatch = useDispatch();
	const theme = useTheme();

	const [selectedGrade, setSelectedGrade] = useState<string>(CLASSGROUP_TRANSLATOR_REVERSED[10]);
	const [selectedCells, setSelectedCells] = useState<string[]>([]);
	const [initSelectedCells, setInitSelectedCells] = useState<string[]>([]);
	//Object để tính số tiết tối đa mà một lớp có thể nghỉ (Day x 5 tiết - số tiết / tuần của lớp)
	const [availableEmptySlots, setAvailableEmptySlots] = useState<IAvailableEmptySlots>({});
	const [isEdited, setIsEdited] = useState<boolean>(false);

	const [gradeOptions, setGradeOptions] = useState<IDropdownOption<string>[]>([]);
	const [sessionOptions, setSessionOptions] = useState<IDropdownOption<number>[]>([]);
	const [classesInGrade, setClassesInGrade] = useState<IDropdownOption<number>[]>([]);

	const [isMouseDown, setIsMouseDown] = useState(false);

	const { data: classData, mutate: updateClass } = useFetchClasses({
		sessionToken,
		schoolId: Number(schoolId),
		grade: selectedGrade,
		pageIndex: 1,
		pageSize: 1000,
		schoolYearId: timetableStored['year-id'] ?? 0,
	});

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
		let tmpAvailableEmptySlots: IAvailableEmptySlots = {};
		if (classData?.status === 200) {
			const tmpClasses: IDropdownOption<number>[] = classData.result.items.map(
				(clazz: IClassResponse) => {
					tmpAvailableEmptySlots[clazz.id] =
						dataStored['days-in-week'] * 10 - clazz['period-count'];
					return {
						label: clazz.name,
						value: clazz.id,
					} as IDropdownOption<number>;
				}
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
		if (dataStored && dataStored['free-timetable-periods-para']) {
			const tmpResults: string[] = [];
			dataStored['free-timetable-periods-para'].forEach((para) => {
				// Với mỗi lần xuất hiện của para, giảm số lượng tiết trống của lớp đó đi 1
				tmpAvailableEmptySlots[para['class-id']] =
					tmpAvailableEmptySlots[para['class-id']] - 1;
				tmpResults.push(`${para['start-at']}-${para['class-id']}`);
			});
			if (tmpResults.length > 0) {
				setInitSelectedCells(tmpResults);
			}
		}
		setAvailableEmptySlots(tmpAvailableEmptySlots);
	}, [classData, dataStored]);

	const handleClearData = () => {
		setSelectedCells([]);
		setIsEdited(false);
	};

	return (
		<div
			className='w-full h-full max-h-[80vh] flex flex-row justify-center items-start overflow-y-hidden'
		>
			<Paper sx={{ width: '95%', mb: 5 }}>
				<Toolbar sx={{ height: 25 }}>
					<div className='w-full flex flex-row justify-start items-baseline gap-5'>
						<Typography>Chọn khối</Typography>
						<FormControl sx={{ width: '10%' }}>
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
					</div>
				</Toolbar>
				<TableContainer className='!no-scrollbar !max-h-[70vh]'>
					<Table size='small' stickyHeader>
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
											textAlign: 'center',
											border: '1px solid #ddd',
											p: 0,
											m: 0,
										}}
									>
										<div className='w-full h-fit flex flex-col justify-start items-center pt-[5%] gap-0'>
											<h1 className='font-bold w-full text-center'>
												{clazz.label}
											</h1>
											<p className='w-full text-center line-clamp-2'>
												({availableEmptySlots[clazz.value]})
											</p>
										</div>
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{WEEK_DAYS_FULL.map((day: string, weekdayIndex: number) => (
								<>
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((slotIndex) => (
										<TableRow key={`${weekdayIndex}-${slotIndex}`}>
											{slotIndex === 1 && (
												<TableCell
													rowSpan={10}
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
													slotIndex <= 5
														? '!text-primary-400'
														: '!text-tertiary-normal'
												}
												width={30}
											>
												{slotIndex}
											</TableCell>
											{classesInGrade.map((clazz) => {
												const cellId = `${weekdayIndex * 10 + slotIndex}-${
													clazz.value
												}`;
												const isSelected =
													selectedCells.includes(cellId) || false;
												const isInitSelected =
													initSelectedCells.includes(cellId);
												return (
													<TableCell
														key={cellId}
														id={cellId}
														sx={{
															border: '1px solid #ddd',
															userSelect: 'none',
															textAlign: 'center',
															backgroundColor: isSelected
																? '#e7e7e7'
																: isInitSelected
																? '#F5F5F5'
																: 'transparent',
														}}
													>
														<Collapse
															in={isSelected || isInitSelected}
															timeout={200}
														>
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

export default DetailsFreeTimetablePeriod