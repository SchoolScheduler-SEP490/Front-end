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
import { FC, useMemo } from 'react';
import { ITopSchoolObject } from '../_libs/constants';
import { SCHOOL_STATUS } from '../../_utils/constants';

interface IDashboardSchoolsProps {
	data: ITopSchoolObject[];
}

const DashboardSchools: FC<IDashboardSchoolsProps> = (props) => {
	const { data } = props;

	const sortedData = useMemo((): ITopSchoolObject[] => {
		return data
			? data
					.sort((a, b) => a.totalTimetable - b.totalTimetable)
					.reverse()
					.slice(0, 5)
			: [];
	}, [data]);
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
								Số TKB đã tạo
							</TableCell>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								Trạng thái
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedData.map((school: ITopSchoolObject, index: number) => (
							<TableRow key={school.id}>
								<TableCell align='center'>{index + 1}</TableCell>
								<TableCell align='left'>{school['school-name']}</TableCell>
								<TableCell align='center'>{school['create-date']}</TableCell>
								<TableCell align='center'>{school.totalTimetable}</TableCell>
								<TableCell align='center'>
									<Chip
										label={SCHOOL_STATUS[school.status]}
										color={SCHOOL_STATUS[school.status] === 'Hoạt động' ? 'success' : 'error'}
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
