'use client';
import LoadingComponent from '@/commons/loading';
import SMHeader from '@/commons/school_manager/header';
import { useAppContext } from '@/context/app_provider';
import { setDataStored } from '@/context/slice_timetable_generation';
import { firestore } from '@/utils/firebaseConfig';
import { IconButton } from '@mui/material';
import { addDoc, collection, getDocs, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TimetableTabs from '../_components/timetable-tabs';
import { IDataStoreObject, TIMETABLE_GENERATION_TABS } from '../_libs/constants';

interface TabPanelProps {
	children?: ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			className='w-full h-full overflow-y-hidden'
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <div className='w-full h-full overflow-y-hidden'>{children}</div>}
		</div>
	);
}

export default function SMConstraintLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const pathName = usePathname();
	const router = useRouter();
	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);
	const { schoolId, selectedSchoolYearId } = useAppContext();
	const fireStoreName = 'configurations';

	const [value, setValue] = useState<number>(0);
	const { dataStored, isModifying }: { dataStored: IDataStoreObject; isModifying: boolean } =
		useSelector((state: any) => state.timetableGeneration);
	const [isNewCreated, setIsNewCreated] = useState<boolean>(false);

	const dispatch = useDispatch();

	// Lấy/xử lý dữ liệu từ Firebase
	useMemo(() => {
		const fetchStoredData = async () => {
			const querySnapshot = await getDocs(collection(firestore, fireStoreName));
			var data: IDataStoreObject = {
				id: '',
				'school-id': Number(schoolId),
				'year-id': selectedSchoolYearId,
				'schedule-id': 0,
				'term-id': 0,
				'teacher-assignments': [],
				'fixed-periods-para': [],
				'no-assign-periods-para': [],
				'free-timetable-periods-para': [],
				'class-combinations': [],
				'applied-curriculum-id': 0,
				'max-period-per-session': 0,
				'min-period-per-session': 0,
			};
			var isExist = false;
			querySnapshot.forEach((doc) => {
				const dataStore: IDataStoreObject = {
					...doc.data(),
					id: doc.id,
				} as IDataStoreObject;
				if (dataStore) {
					data = { ...dataStore, id: doc.id };
					isExist = true;
				}
			});
			if (isExist && dataStored.id === '') {
				dispatch(setDataStored(data));
			}

			if (!isExist) {
				setIsNewCreated(true);
				const res = await addDoc(collection(firestore, fireStoreName), data);
				if (res && !isNewCreated) {
					data = { ...data, id: res.id };
				}
			}
			dispatch(setDataStored(data));
		};
		if (!isNewCreated) {
			fetchStoredData();
		}
	}, []);

	useEffect(() => {
		const handleBeforeUnload = (event: any) => {
			if (isModifying) {
				// Hiển thị thông báo tùy chỉnh
				event.preventDefault(); // Ngăn rời khỏi trang
				event.returnValue = ''; // Bắt buộc cho một số trình duyệt
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	useEffect(() => {
		if (pathName.length > 0) {
			const currentTab: string[] = pathName.split('/');
			const tabIndex = TIMETABLE_GENERATION_TABS.findIndex((tab) =>
				currentTab.includes(tab.value)
			);
			setValue(tabIndex);
		}
	}, [pathName]);

	return (
		<section
			className={`w-[${
				!isMenuOpen ? '84' : '100'
			}%] h-fit min-h-screen max-h-[100vh] flex flex-col justify-start items-start overflow-y-hidden`}
		>
			<SMHeader>
				<div className='flex flex-row justify-start items-center gap-2'>
					<IconButton color='info' onClick={() => router.back()}>
						<Image
							src='/images/icons/arrow.png'
							alt='Trở lại'
							width={20}
							height={20}
							unoptimized={true}
						/>
					</IconButton>
					<h3 className='text-title-small text-white font-medium tracking-wider'>
						Tạo thời khóa biểu
					</h3>
				</div>
			</SMHeader>
			<TimetableTabs />
			<CustomTabPanel value={value} index={value}>
				{children}
			</CustomTabPanel>
		</section>
	);
}
