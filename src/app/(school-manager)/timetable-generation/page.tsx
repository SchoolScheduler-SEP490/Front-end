'use client';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import useFetchSchoolYear from '@/hooks/useFetchSchoolYear';
import useFetchTerm from '@/hooks/useFetchTerm';
import useNotify from '@/hooks/useNotify';
import { ISchoolYearResponse, ITermResponse } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import {
	Button,
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	Select,
	TextField,
} from '@mui/material';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IDropdownOption } from '../_utils/contants';
import {
	ETimetableStatus,
	IConfigurationStoreObject,
	ITimetableStoreObject,
	TIMETABLE_GENERATION_TABS,
} from './_libs/constants';

const ITEM_HEIGHT = 30;
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

interface ISortableDropdown<T> extends IDropdownOption<T> {
	criteria: string | number;
}

export default function Home() {
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);
	const { selectedSchoolYearId, schoolId } = useAppContext();
	const router = useRouter();
	const pathName = usePathname();

	const [schoolYearIdOptions, setSchoolYearIdOptions] = useState<IDropdownOption<number>[]>([]);
	const [termIdOptions, setTermIdOptions] = useState<ISortableDropdown<number>[]>([]);
	const [editingObject, setEditingObject] = useState<ITimetableStoreObject>({
		'timetable-name': '',
		'timetable-abbreviation': '',
		'school-id': 0,
		'year-id': 0,
		'term-id': 0,
		'config-id': '',
		status: ETimetableStatus.Pending,
	});

	const { data: schoolYearData, mutate } = useFetchSchoolYear();
	const {
		data: termData,
		error: termFetchError,
		mutate: updateTerm,
	} = useFetchTerm({
		pageIndex: 1,
		pageSize: 100,
		schoolYearId: selectedSchoolYearId,
	});

	const handleUpdateTimetable = (target: keyof ITimetableStoreObject, value: any) => {
		setEditingObject((prev) => ({ ...prev, [target]: value }));
	};

	// Process data
	useEffect(() => {
		if (termData?.status === 200) {
			const studyOptions: ISortableDropdown<number>[] = termData.result.items.map(
				(item: ITermResponse) => ({
					value: item.id,
					label: `${item.name} | (${item['school-year-start']}-${item['school-year-end']}) `,
					criteria: item.name,
				})
			);
			setTermIdOptions(
				studyOptions.sort((a, b) =>
					(a.criteria as string).localeCompare(b.criteria as string)
				)
			);
			handleUpdateTimetable('term-id', studyOptions[0].value);
		}
	}, [termData]);

	useEffect(() => {
		updateTerm({ schoolYearId: editingObject['year-id'] });
		if (termData?.status === 200) {
			const termInYear: ITermResponse[] = termData.result.items.filter(
				(term: ITermResponse) => term['school-year-id'] === editingObject['year-id']
			);
			if (termInYear.length > 0) {
				const studyOptions: ISortableDropdown<number>[] = termInYear.map(
					(item: ITermResponse) => ({
						value: item.id,
						label: `${item.name} | (${item['school-year-start']}-${item['school-year-end']}) `,
						criteria: item.name,
					})
				);
				setTermIdOptions(
					studyOptions.sort((a, b) =>
						(a.criteria as string).localeCompare(b.criteria as string)
					)
				);
				if (!studyOptions.some((item) => item.value === editingObject['term-id'])) {
					handleUpdateTimetable('term-id', studyOptions[0].value);
				} else {
					useNotify({
						type: 'error',
						message: 'Không có học kỳ cho năm học này',
					});
				}
			}
		}
	}, [editingObject['year-id']]);

	const handleCreateTimetable = async () => {
		if (editingObject) {
			// Tạo timetable object lên Firebase
			var newConfigurationData: IConfigurationStoreObject = {
				id: '',
				'timetable-id': '',
				'teacher-assignments': [],
				'fixed-periods-para': [],
				'no-assign-periods-para': [],
				'free-timetable-periods-para': [],
				'class-combinations': [],
				'applied-curriculum-id': 0,
				'max-period-per-session': 0,
				'min-period-per-session': 0,
			};
			const timetableRef = await addDoc(collection(firestore, 'timetables'), editingObject);
			const configRef = await addDoc(
				collection(firestore, 'configurations'),
				newConfigurationData
			);
			if (timetableRef.id && configRef.id) {
				await updateDoc(timetableRef, { 'config-id': configRef.id });
				await updateDoc(configRef, { 'timetable-id': timetableRef.id });
				useNotify({
					type: 'success',
					message: 'Tạo thời khóa biểu thành công',
				});
				router.push(`${pathName}/${timetableRef.id}/${TIMETABLE_GENERATION_TABS[0].value}`);
			}
		}
	};

	useEffect(() => {
		mutate();
		if (schoolYearData?.status === 200) {
			const options: IDropdownOption<number>[] = schoolYearData.result.map(
				(item: ISchoolYearResponse) => {
					const currentYear = new Date().getFullYear();
					if (
						parseInt(item['start-year']) <= currentYear &&
						parseInt(item['end-year']) >= currentYear
					) {
						handleUpdateTimetable('year-id', item.id);
					}
					return {
						label: `${item['start-year']} - ${item['end-year']}`,
						value: item.id,
					} as IDropdownOption<number>;
				}
			);
			setSchoolYearIdOptions(options.sort((a, b) => a.label.localeCompare(b.label)));
		}
	}, [schoolYearData]);

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start`}
		>
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-medium tracking-wider'>
						Tạo thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-full flex flex-col justify-start pt-[20vh] items-center'>
				<div className='w-[30vw] h-[40vh] flex flex-col justify-start items-center gap-3'>
					<h1 className='text-title-large-strong text-primary-500'>
						Thông tin Thời khóa biểu
					</h1>
					<TextField
						fullWidth
						variant='standard'
						id='email'
						name='email'
						label='Nhập tên Thời khóa biểu'
						value={editingObject['timetable-name']}
						onChange={(event) =>
							handleUpdateTimetable('timetable-name', event.target.value)
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
					<TextField
						fullWidth
						variant='standard'
						id='email'
						name='email'
						label='Nhập mã Thời khóa biểu'
						value={editingObject['timetable-abbreviation']}
						onChange={(event) =>
							handleUpdateTimetable('timetable-abbreviation', event.target.value)
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
					<FormControl sx={{ width: '100%' }}>
						<InputLabel id='school-year-label' variant='standard'>
							Chọn năm học
						</InputLabel>
						<Select
							labelId='school-year-label'
							id='school-year'
							variant='standard'
							value={
								editingObject['year-id'] === 0
									? ''
									: schoolYearIdOptions.find(
											(item) => item.value === editingObject['year-id']
									  )
							}
							onChange={(event) =>
								handleUpdateTimetable('year-id', Number(event.target.value))
							}
							MenuProps={MenuProps}
							renderValue={(selected) => {
								return selected.label;
							}}
							sx={{ width: '100%', fontSize: '1.000rem' }}
						>
							{schoolYearIdOptions?.length === 0 && (
								<MenuItem disabled value={0}>
									Không tìm thấy năm học
								</MenuItem>
							)}
							{schoolYearIdOptions.map((item, index) => (
								<MenuItem key={item.label + index} value={item.value}>
									<Checkbox
										checked={
											editingObject['year-id'] === 0
												? false
												: editingObject['year-id'] === item.value
										}
									/>
									<ListItemText primary={item.label} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ width: '100%' }}>
						<InputLabel id='school-term-label' variant='standard'>
							Chọn học kỳ
						</InputLabel>
						<Select
							labelId='school-term-label'
							id='school-term'
							variant='standard'
							value={
								editingObject['term-id'] === 0
									? ''
									: termIdOptions.find(
											(item) => item.value === editingObject['term-id']
									  )
							}
							onChange={(event) =>
								handleUpdateTimetable('term-id', Number(event.target.value))
							}
							MenuProps={MenuProps}
							renderValue={(selected) => {
								return selected.label;
							}}
							sx={{ width: '100%', fontSize: '1.000rem' }}
						>
							{termIdOptions?.length === 0 && (
								<MenuItem disabled value={0}>
									Không tìm thấy năm học
								</MenuItem>
							)}
							{termIdOptions.map((item, index) => (
								<MenuItem key={item.label + index} value={item.value}>
									<Checkbox
										checked={
											editingObject['term-id'] === 0
												? false
												: editingObject['term-id'] === item.value
										}
									/>
									<ListItemText primary={item.label} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<Button
						variant='contained'
						fullWidth
						onClick={handleCreateTimetable}
						color='inherit'
						sx={{
							bgcolor: '#175b8e',
							color: 'white',
							borderRadius: 0,
							marginTop: '2vh',
						}}
					>
						Tạo thời khóa biểu
					</Button>
				</div>
			</div>
		</div>
	);
}
