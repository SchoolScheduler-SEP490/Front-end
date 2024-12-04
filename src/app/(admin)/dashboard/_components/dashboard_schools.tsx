import {
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { FC } from 'react';

type School = {
	id: number;
	name: string;
	createdDate: string;
	region: string;
	schedulesCreated: number;
	status: 'Hoạt động' | 'Vô hiệu';
};

const schools: School[] = [
	{
		id: 1,
		name: 'THPT Chuyên Nguyễn Du',
		createdDate: '20/08/2010',
		region: 'Đắk Lắk',
		schedulesCreated: 100,
		status: 'Hoạt động',
	},
	{
		id: 2,
		name: 'THPT Chuyên Hùng Vương',
		createdDate: '18/07/2012',
		region: 'Đà Nẵng',
		schedulesCreated: 80,
		status: 'Hoạt động',
	},
	{
		id: 3,
		name: 'THPT Amsterdam',
		createdDate: '07/12/2018',
		region: 'Hà Nội',
		schedulesCreated: 50,
		status: 'Hoạt động',
	},
	{
		id: 4,
		name: 'Trường THPT Nguyễn Tất Thành',
		createdDate: '09/09/2020',
		region: 'TP.HCM',
		schedulesCreated: 30,
		status: 'Hoạt động',
	},
	{
		id: 5,
		name: 'Trường THPT Chuyên Lào Cai',
		createdDate: '10/01/2024',
		region: 'Lào Cai',
		schedulesCreated: 10,
		status: 'Vô hiệu',
	},
];

interface IDashboardSchoolsProps {
	// Add your data here
}

const DashboardSchools: FC<IDashboardSchoolsProps> = (props) => {
	const {} = props;
	return (
		<div className='w-full h-[40%] px-2 mb-[5vh]'>
			<Typography variant='h6' sx={{ p: 2 }}>
				Top trường sử dụng
			</Typography>
			<TableContainer>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								STT
							</TableCell>
							<TableCell align='left' sx={{ fontWeight: 'bold' }}>
								Tên trường
							</TableCell>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								Ngày tạo
							</TableCell>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								Khu vực
							</TableCell>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								Số TKB đã tạo
							</TableCell>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								Trạng thái
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{schools.map((school) => (
							<TableRow key={school.id}>
								<TableCell align='center'>{school.id}</TableCell>
								<TableCell align='left'>{school.name}</TableCell>
								<TableCell align='center'>{school.createdDate}</TableCell>
								<TableCell align='center'>{school.region}</TableCell>
								<TableCell align='center'>{school.schedulesCreated}</TableCell>
								<TableCell align='center'>
									<Chip
										label={school.status}
										color={school.status === 'Hoạt động' ? 'success' : 'error'}
										variant='outlined'
										sx={{
											fontWeight: 'bold',
										}}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default DashboardSchools;
