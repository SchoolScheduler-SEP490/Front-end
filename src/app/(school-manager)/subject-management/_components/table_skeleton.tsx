import LoadingComponent from '@/commons/loading';
import SMHeader from '@/commons/school_manager/header';
import {
	Paper,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

const TableSkeleton = ({ isLoading }: { isLoading: boolean }) => {
	return (
		<div className='w-[84%] h-screen flex flex-col justify-start items-start overflow-y-scroll'>
			<LoadingComponent loadingStatus={isLoading} />
			<SMHeader>
				<div>
					<h3 className='text-title-small text-white font-semibold tracking-wider'>
						Môn học
					</h3>
				</div>
			</SMHeader>
			<TableContainer component={Paper} sx={{ paddingX: '20vw' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>STT</TableCell>
							<TableCell>Tên môn học</TableCell>
							<TableCell>Mã môn</TableCell>
							<TableCell>Tổ bộ môn</TableCell>
							<TableCell>Loại môn học`</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{[...Array(5)].map((row, index) => (
							<TableRow key={index}>
								<TableCell component='th' scope='row'>
									<Skeleton animation='wave' variant='text' />
								</TableCell>
								<TableCell>
									<Skeleton animation='wave' variant='text' />
								</TableCell>
								<TableCell>
									<Skeleton animation='wave' variant='text' />
								</TableCell>
								<TableCell>
									<Skeleton animation='wave' variant='text' />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TableSkeleton;
