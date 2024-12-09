'use client';
import AdminHeader from '@/commons/admin/header';
import { useAppContext } from '@/context/app_provider';
import { IAdminState } from '@/context/slice_admin';
import { useAdminSelector } from '@/hooks/useReduxStore';
import { ITimetableStoreObject, TIMETABLE_FIRESTORE_NAME } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import DashboardGraph from './_components/dashboard_graph';
import DashboardNumbers from './_components/dashboard_numbers';
import DashboardRequests from './_components/dashboard_requests';
import DashboardSchools from './_components/dashboard_schools';
import useFetchAccounts from './_hooks/useFetchAccounts';
import { IAccountResponse, ITopSchoolObject, ITotalNumberObject } from './_libs/constants';

interface ITimetableCountObject {
	[key: number]: number;
}

export default function AdminHome() {
	const { sessionToken } = useAppContext();
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);

	const [numberSummaryData, setNumberSummaryData] = useState<ITotalNumberObject>({
		averageFitness: 0,
		averageTimeCost: 0,
		totalSchoolUsed: 0,
		totalSchoolPending: 0,
	});
	// Data sử dụng cho trường đang ở trạng thái Pending
	const [requestData, setRequestData] = useState<IAccountResponse[]>([]);

	//Data của trường có số lượng tkb gen ra lớn nhất (LẤY TOP 5)
	const [topSchoolData, setTopSchoolData] = useState<ITopSchoolObject[]>([]);

	//Data phụ, dùng để lấy được số lượng tkb đã tạo của trường
	const [timetableCountBySchoolId, setTimetableCountBySchoolId] = useState<ITimetableCountObject>(
		{}
	);

	// Chắc chắn phải load nhiều nên đặt trạng thái loading đỡ thời gian render
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { data: pendingAccountData, mutate: updatePendingAccountData } = useFetchAccounts({
		pageIndex: 1,
		pageSize: 1000,
		sessionToken,
		accountStatus: 'Pending',
	});

	const { data: activeAccountData, mutate: updateActiveAccountData } = useFetchAccounts({
		pageIndex: 1,
		pageSize: 1000,
		sessionToken,
		accountStatus: 'Active',
	});

	// Lấy dữ liệu tkb từ firebase -> count tkb,
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const querySnapshot = await getDocs(collection(firestore, TIMETABLE_FIRESTORE_NAME));
			let tmpTotalFitness = 0;
			let tmpTotalTimeCost = 0;
			let tmpTimetableCount: ITimetableCountObject = {};
			querySnapshot.forEach((doc) => {
				if (doc.exists()) {
					const tmpData = doc.data() as ITimetableStoreObject;
					// Nếu tkb đã gen thì mới tính
					if (tmpData['generated-schedule-id'] !== null) {
						tmpTotalFitness += tmpData['fitness-point'];
						tmpTotalTimeCost += tmpData['time-cost'];
						// Check xem giá trị đã có chưa, nếu chưa thì tạo mới, nếu rồi thì thêm vào
						if (tmpTimetableCount[tmpData['school-id']]) {
							tmpTimetableCount[tmpData['school-id']] += 1;
						} else {
							tmpTimetableCount[tmpData['school-id']] = 1;
						}
					}
				}
			});
			if (tmpTotalFitness > 0 && tmpTotalTimeCost > 0) {
				setNumberSummaryData((prev) => ({
					...prev,
					averageFitness: tmpTotalFitness / querySnapshot.size,
					averageTimeCost: tmpTotalTimeCost / querySnapshot.size,
				}));
			}
			if (Object.keys(tmpTimetableCount).length > 0) {
				setTimetableCountBySchoolId(tmpTimetableCount);
			}
			setIsLoading(false);
		};
		fetchData();
	}, []);

	useEffect(() => {
		updatePendingAccountData();
		if (pendingAccountData?.status === 200) {
			setNumberSummaryData((prev) => ({
				...prev,
				totalSchoolPending: pendingAccountData.result['total-item-count'],
			}));

			const tmpRequestData: IAccountResponse[] = pendingAccountData.result.items;
			if (tmpRequestData.length > 0) {
				setRequestData(tmpRequestData);
			}
		}
	}, [pendingAccountData]);

	useEffect(() => {
		updateActiveAccountData();
		if (activeAccountData?.status === 200) {
			setNumberSummaryData((prev) => ({
				...prev,
				totalSchoolUsed: activeAccountData.result['total-item-count'],
			}));

			const tmpActiveData: ITopSchoolObject[] = activeAccountData.result.items.map(
				(school: IAccountResponse) =>
					({
						...school,
						totalTimetable: 0,
					} as ITopSchoolObject)
			);
			if (tmpActiveData.length > 0) {
				const tmpTopSchoolData = tmpActiveData.map((school) => {
					if (Object.keys(timetableCountBySchoolId).includes(school['school-id'].toString())) {
						return {
							...school,
							totalTimetable: timetableCountBySchoolId[school['school-id']],
						};
					}
					return school;
				});
				if (tmpTopSchoolData.length > 0) {
					setTopSchoolData(tmpTopSchoolData);
				}
			}
		}
	}, [activeAccountData, timetableCountBySchoolId]);

	useEffect(() => {
		if (topSchoolData.length > 0 && Object.entries(timetableCountBySchoolId).length > 0) {
		}
	}, []);

	return (
		<div className={`w-[${!isMenuOpen ? '84' : '100'}%] h-screen`}>
			<AdminHeader>
				<div className='w-fit h-full flex flex-row justify-start items-center'>
					<h1 className='text-title-small text-white font-medium tracking-wider'>Tổng quan</h1>
				</div>
			</AdminHeader>
			<div className='w-full h-full flex flex-row justify-between items-start'>
				<div
					className={`w-[${
						!isMenuOpen ? '70' : '75'
					}%] h-full max-h-[95vh] overflow-y-scroll no-scrollbar`}
				>
					<div className='w-full h-fit flex flex-col justify-start items-center pl-2 mb-[4vh] mt-[2vh]'>
						<DashboardNumbers data={numberSummaryData} />
						<DashboardGraph />
						<DashboardSchools data={topSchoolData} />
					</div>
				</div>
				<div
					className={`w-[${
						!isMenuOpen ? '30' : '25'
					}%] h-full max-h-[95vh] overflow-y-scroll no-scrollbar`}
				>
					<DashboardRequests data={requestData} />
				</div>
			</div>
		</div>
	);
}
