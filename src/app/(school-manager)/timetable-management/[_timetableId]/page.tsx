'use client';

import SMHeader from '@/commons/school_manager/header';
import {
	IConfigurationStoreObject,
	IScheduleResponse,
	ITimetableStoreObject,
} from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import DetailsConfiguration from './_components/details_configurations';
import DetailsSolution from './_components/details_solution';
import {
	ITimetableGenerationState,
	setDataStored,
	setGeneratedScheduleStored,
	setTimetableId,
	setTimetableStored,
} from '@/context/slice_timetable_generation';
import { useSMDispatch, useSMSelector } from '@/hooks/useReduxStore';
import useNotify from '@/hooks/useNotify';

export default function TimetableDetail() {
	const params = useParams();
	const timetableId = params._timetableId;
	const router = useRouter();
	const [selectedTeacher, setSelectedTeacher] = useState('all');
	const [scheduleData, setScheduleData] = useState<IScheduleResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const isMenuOpen = useSelector((state: any) => state.schoolManager.isMenuOpen);
	const [activeTab, setActiveTab] = useState(0);
	const [configTab, setConfigTab] = useState(0);
	const [notes, setNotes] = useState<string>('');
	const dispatch = useSMDispatch();

	const handleBack = () => {
		router.push('/timetable-management');
	};

	const teacherNames: string[] = useMemo(() => {
		if (!scheduleData) return [];
		const teachers = new Set();
		scheduleData['class-schedules'].forEach((schedule) => {
			schedule['class-periods'].forEach((period) => {
				teachers.add(period['teacher-abbreviation']);
			});
		});
		return Array.from(teachers) as string[];
	}, [scheduleData]);

	const {
		dataFirestoreName,
		timetableFirestoreName,
		timetableStored,
		generatedScheduleFirestorename,
	}: ITimetableGenerationState = useSMSelector((state) => state.timetableGeneration);

	useMemo(() => {
		const fetchStoreTimetable = async () => {
			const docRef = doc(firestore, timetableFirestoreName, timetableId as string);
			const docSnap = await getDoc(docRef);
			const timetableStore: ITimetableStoreObject = docSnap.data() as ITimetableStoreObject;
			if (timetableStore) {
				if (timetableStore['generated-schedule-id']) {
					const docRef = doc(
						firestore,
						generatedScheduleFirestorename,
						timetableStore['generated-schedule-id']
					);
					const docSnap = await getDoc(docRef);
					const generatedSchedule = docSnap.data() as IScheduleResponse;
					dispatch(setGeneratedScheduleStored(generatedSchedule));
					setScheduleData(generatedSchedule);
				}
				dispatch(setTimetableStored(timetableStore));
			}
		};
		fetchStoreTimetable();
	}, []);

	// Lấy/xử lý dữ liệu configuration từ Firebase
	useMemo(() => {
		const fetchStoredData = async () => {
			const q = query(
				collection(firestore, dataFirestoreName),
				where('timetable-id', '==', timetableId)
			);
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				if (doc.data()['timetable-id'] === timetableId) {
					const dataStore: IConfigurationStoreObject = {
						...doc.data(),
						id: doc.id,
					} as IConfigurationStoreObject;
					if (dataStore) {
						dispatch(setDataStored(dataStore));
					}
				}
			});
			if (querySnapshot.size === 0) {
				useNotify({
					type: 'error',
					message: 'Không tìm thấy dữ liệu cấu hình của TKB',
				});
				notFound();
			}
		};
		fetchStoredData();
	}, []);

	useEffect(() => {
		if (timetableId) {
			dispatch(setTimetableId(timetableId as string));
		}
	}, []);

	return (
		<div
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar`}
		>
			<SMHeader>
				<div className='flex items-center gap-4'>
					<IconButton onClick={handleBack} sx={{ color: 'white' }}>
						<ArrowBackIcon />
					</IconButton>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Chi tiết Thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<div className='w-full h-fit border-b border-basic-gray'>
				<Tabs
					value={activeTab}
					onChange={(e, newValue) => setActiveTab(newValue)}
					sx={{
						'& .MuiTab-root': {
							textTransform: 'none',
							fontWeight: 500,
							color: 'rgba(0, 0, 0, 0.6)',
							'&.Mui-selected': {
								color: '#004e89',
								fontWeight: 600,
							},
						},
					}}
				>
					<Tab label='Cấu hình' />
					<Tab label='Kết quả' />
					<Tab label='Ghi chú' />
				</Tabs>
			</div>

			{activeTab === 0 && <DetailsConfiguration />}

			{activeTab === 1 && (
				<>
					{!isLoading && !scheduleData ? (
						<div className='flex flex-col justify-center items-center w-full h-full gap-8 bg-gradient-to-b from-gray-50 to-white p-12 rounded-xl shadow-xl'>
							<div className='flex justify-center transform transition-all duration-500 hover:scale-110'>
								<Image
									src='/images/icons/empty-folder.png'
									alt='No schedule available'
									width={250}
									height={200}
									unoptimized={true}
									className='opacity-90 drop-shadow-lg'
								/>
							</div>

							<div className='text-center space-y-2'>
								<Typography variant='h5' className='text-gray-700 font-semibold tracking-wide'>
									Thời khóa biểu chưa được tạo!
								</Typography>
								<Typography variant='body1' className='text-gray-500'>
									Bấm nút bên dưới để bắt đầu tạo thời khóa biểu mới
								</Typography>
							</div>

							<Button
								variant='contained'
								size='medium'
								className='!bg-primary-500 !hover:bg-primary-600 text-white px-8 py-3 rounded-s 
       transform transition-all duration-300 hover:scale-105 hover:shadow-lg
       flex items-center gap-2'
								onClick={() => router.push(`/timetable-generation/${timetableId}/information`)}
							>
								<AddIcon />
								Tạo thời khóa biểu
							</Button>
						</div>
					) : (
						<DetailsSolution
							scheduleData={scheduleData}
							selectedTeacher={selectedTeacher}
							setSelectedTeacher={setSelectedTeacher}
							teacherNames={teacherNames}
							timetableId={timetableId as string}
						/>
					)}
				</>
			)}
			{activeTab === 2 && (
				<div className='w-full h-full p-6 bg-white'>
					<div className='max-w-4xl mx-auto'>
						<Typography variant='h6' className='mb-4 text-gray-700'>
							Ghi chú cho thời khóa biểu
						</Typography>

						<TextField
							fullWidth
							multiline
							rows={10}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder='Nhập ghi chú cho thời khóa biểu...'
							variant='outlined'
							sx={{
								'& .MuiOutlinedInput-root': {
									backgroundColor: '#f8f9fa',
									'&:hover': {
										backgroundColor: '#fff',
									},
								},
							}}
						/>
						<div className='flex justify-end mt-4'>
							<Button variant='contained' className='!bg-primary-500' onClick={() => {}}>
								Lưu ghi chú
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
