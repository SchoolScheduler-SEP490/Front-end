'use client';
import SMHeader from '@/commons/school_manager/header';
import {
	ITimetableGenerationState,
	setDataStored,
	setTimetableId,
} from '@/context/slice_timetable_generation';
import { firestore } from '@/utils/firebaseConfig';
import { IconButton } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TimetableTabs from '../_components/timetable-tabs';
import { IConfigurationStoreObject, TIMETABLE_GENERATION_TABS } from '../_libs/constants';
import useNotify from '@/hooks/useNotify';

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

export default function SMConstraintLayout({ children }: { children: ReactNode }) {
	const pathName = usePathname();
	const router = useRouter();
	const dispatch = useDispatch();

	const isMenuOpen: boolean = useSelector((state: any) => state.schoolManager.isMenuOpen);
	const [value, setValue] = useState<number>(0);
	const [timetableId, setPathTimetableId] = useState<string>(pathName.split('/')[2]);
	const { isModifying, fireStoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);

	// Lấy/xử lý dữ liệu từ Firebase
	useMemo(() => {
		const fetchStoredData = async () => {
			const q = query(
				collection(firestore, fireStoreName),
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
			}
		};
		fetchStoredData();
	}, []);

	useEffect(() => {
		if (timetableId) {
			dispatch(setTimetableId(timetableId));
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
							width={15}
							height={15}
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
