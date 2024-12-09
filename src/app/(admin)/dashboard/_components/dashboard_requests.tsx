'use client';
import { Button, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { ACCOUNT_STATUS } from '../../_utils/constants';
import { IAccountResponse } from '../_libs/constants';
import DashboardRequestModal from './dashboard_requests_modal';

interface IDashboardRequestsProps {
	data: IAccountResponse[];
}

const formatDateString = (dateString: string): string => {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

const DashboardRequests: FC<IDashboardRequestsProps> = (props) => {
	const { data } = props;

	const [selectedAccount, setSelectedAccount] = useState<IAccountResponse>({} as IAccountResponse);
	const [isConfirmRequestOpen, setIsConfirmRequestOpen] = useState<boolean>(false);

	const handleSelectAccount = (account: IAccountResponse) => {
		setSelectedAccount(account);
		setIsConfirmRequestOpen(true);
	};

	const handleApproveRequest = () => {};

	const handelRejectRequest = () => {};

	const sortedData = useMemo((): IAccountResponse[] => {
		return data
			? data.sort(
					(a, b) => new Date(b['create-date']).getTime() - new Date(a['create-date']).getTime()
			  )
			: [];
	}, [data]);

	return (
		<div className='w-full h-fit mb-[5vh]'>
			<div className='relative p-4'>
				<h2 className='text-body-xlarge font-semibold sticky top-0 left-0 z-10 bg-white px-2 py-3'>
					Đơn đăng ký trường (6)
				</h2>
				<div className='flex flex-col gap-4'>
					{sortedData.map((request: IAccountResponse, index: number) => (
						<div key={index} className='p-4 bg-basic-gray-hover'>
							<h3 className='text-body-large-strong'>{request['school-name']}</h3>
							<p className='text-sm text-gray-600 mb-2'>Đăng ký tài khoản trường học</p>
							<div className='w-full h-fit flex flex-row justify-between items-start'>
								<div className='w-full h-full flex flex-col justify-between items-start gap-2'>
									<p className='text-sm'>
										Mã đơn:{' '}
										<span className='font-semibold'>
											DKTK0{String(request.id).padStart(2, '0')}
										</span>
									</p>
									<p className='text-sm mb-4'>
										Trạng thái:{' '}
										<span
											className={`font-semibold ${
												request.status === 'Pending' ? 'text-tertiary-normal' : ''
											}`}
										>
											{ACCOUNT_STATUS[request.status]}
										</span>
									</p>
								</div>
								<div className='w-full h-full flex flex-col justify-between items-end gap-1'>
									<p className='text-sm'>
										Ngày tạo:{' '}
										<span className='font-semibold'>
											{formatDateString(request['create-date'])}
										</span>
									</p>
									<Button
										variant='contained'
										color='inherit'
										size='small'
										onClick={() => handleSelectAccount(request)}
										sx={{
											bgcolor: '#004e89',
											color: 'white',
											boxShadow: 'none',
											borderRadius: 0,
										}}
									>
										<Typography fontSize={13}>Xem chi tiết</Typography>
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<DashboardRequestModal
				selectedAccount={selectedAccount}
				open={isConfirmRequestOpen}
				setOpen={setIsConfirmRequestOpen}
				handleConfirm={handleApproveRequest}
				handleReject={handelRejectRequest}
			/>
		</div>
	);
};

export default DashboardRequests;
