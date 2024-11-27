'use client';
import SMHeader from '@/commons/school_manager/header';
import {
	ITimetableGenerationState,
	setDataStored,
	setGeneratedScheduleStored,
	setTimetableId,
	setTimetableStored,
} from '@/context/slice_timetable_generation';
import { firestore } from '@/utils/firebaseConfig';
import { IconButton, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TimetableTabs from '../_components/timetable-tabs';
import { TIMETABLE_GENERATION_TABS } from '../_libs/constants';
import useNotify from '@/hooks/useNotify';
import {
	IConfigurationStoreObject,
	IScheduleResponse,
	ITimetableStoreObject,
} from '@/utils/constants';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 15,
	},
}));

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
	const {
		dataFirestoreName,
		timetableFirestoreName,
		timetableStored,
		generatedScheduleFirestorename,
	}: ITimetableGenerationState = useSelector((state: any) => state.timetableGeneration);

	useMemo(() => {
		const fetchStoreTimetable = async () => {
			const docRef = doc(firestore, timetableFirestoreName, timetableId);
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
				<div className='flex flex-row justify-start items-baseline gap-2'>
					<IconButton color='info' onClick={() => router.back()}>
						<Image
							src='/images/icons/arrow.png'
							alt='Trở lại'
							width={15}
							height={15}
							unoptimized={true}
						/>
					</IconButton>
					<LightTooltip
						title={timetableStored['timetable-name']}
						placement='bottom'
						arrow
					>
						<h3 className='text-title-small text-white font-medium tracking-wider'>
							{timetableStored['timetable-abbreviation'] !== null
								? timetableStored['timetable-abbreviation']
								: ''}
						</h3>
					</LightTooltip>
					<h6 className='text-body-small text-white opacity-80'>
						{timetableStored['term-name'] ?? ''}
					</h6>
				</div>
			</SMHeader>
			<TimetableTabs />
			<CustomTabPanel value={value} index={value}>
				{children}
			</CustomTabPanel>
		</section>
	);
}
