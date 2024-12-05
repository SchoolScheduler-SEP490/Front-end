'use client';
import AdminHeader from '@/commons/admin/header';
import { IAdminState } from '@/context/slice_admin';
import { useAdminSelector } from '@/hooks/useReduxStore';
import DashboardNumbers from './_components/dashboard_numbers';
import DashboardGraph from './_components/dashboard_graph';
import DashboardSchools from './_components/dashboard_schools';
import DashboardRequests from './_components/dashboard_requests';

export default function AdminHome() {
	const { isMenuOpen }: IAdminState = useAdminSelector((state) => state.admin);

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
						<DashboardNumbers />
						<DashboardGraph />
						<DashboardSchools />
					</div>
				</div>
				<div
					className={`w-[${
						!isMenuOpen ? '30' : '25'
					}%] h-full max-h-[95vh] overflow-y-scroll no-scrollbar`}
				>
					<DashboardRequests />
				</div>
			</div>
		</div>
	);
}
