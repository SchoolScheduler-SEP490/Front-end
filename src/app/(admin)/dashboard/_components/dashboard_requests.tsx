import { Button } from '@mui/material';
import { FC } from 'react';

type Request = {
	id: string;
	schoolName: string;
	requestType: string;
	requestCode: string;
	region: string;
	dueDate: string;
};

const requests: Request[] = [
	{
		id: '1',
		schoolName: 'Trường THPT Chuyên Đà Nẵng',
		requestType: 'Yêu cầu sử dụng Chương trình tự chọn',
		requestCode: 'CRND001',
		region: 'Đà Nẵng',
		dueDate: '1/12/2024',
	},
	{
		id: '2',
		schoolName: 'Trường THPT Amsterdam Hà Nội',
		requestType: 'Đăng ký tạo tài khoản',
		requestCode: 'CASM001',
		region: 'Hà Nội',
		dueDate: '1/12/2024',
	},
	{
		id: '3',
		schoolName: 'Trường THPT Nguyễn Tất Thành',
		requestType: 'Yêu cầu hủy tài khoản',
		requestCode: 'DASM001',
		region: 'TP.HCM',
		dueDate: '1/12/2024',
	},
	{
		id: '4',
		schoolName: 'Trường THPT Nguyễn Du',
		requestType: 'Đăng ký ràng buộc hệ thống',
		requestCode: 'RCSM001',
		region: 'Đắk Lắk',
		dueDate: '1/12/2024',
	},
	{
		id: '5',
		schoolName: 'Trường THPT Nguyễn Du',
		requestType: 'Yêu cầu sử dụng Chương trình tự chọn',
		requestCode: 'CRND001',
		region: 'Đắk Lắk',
		dueDate: '1/12/2024',
	},
];

interface IDashboardRequestsProps {
	// Add your data here
}

const DashboardRequests: FC<IDashboardRequestsProps> = (props) => {
	const {} = props;
	return (
		<div className='w-full h-fit mb-[5vh]'>
			<div className='relative p-4'>
				<h2 className='text-xl font-semibold sticky top-0 left-0 z-10 bg-white px-2 py-3'>
					Yêu cầu chờ xử lý
				</h2>
				<div className='flex flex-col gap-4'>
					{requests.map((request) => (
						<div key={request.id} className='p-4 bg-primary-50'>
							<h3 className='text-lg font-bold'>{request.schoolName}</h3>
							<p className='text-sm text-gray-600 mb-2'>{request.requestType}</p>
							<p className='text-sm'>
								Mã đơn: <span className='font-semibold'>{request.requestCode}</span>
							</p>
							<p className='text-sm'>
								Khu vực: <span className='font-semibold'>{request.region}</span>
							</p>
							<p className='text-sm mb-4'>
								Hạn xử lý: <span className='font-semibold'>{request.dueDate}</span>
							</p>
							<Button variant='contained' color='primary' size='small' sx={{ boxShadow: 'none' }}>
								Xem chi tiết
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DashboardRequests;
