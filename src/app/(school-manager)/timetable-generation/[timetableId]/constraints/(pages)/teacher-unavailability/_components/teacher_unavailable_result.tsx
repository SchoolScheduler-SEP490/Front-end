import DeleteIcon from '@mui/icons-material/Delete';
import {
	IconButton,
	Paper,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { ITeacherUnavailability } from '../_libs/constants';

interface ITeacherUnavailableResultProps {
	data: ITeacherUnavailability[];
	isLoading: boolean;
	handleDelete: (teacherId: number) => void;
	handleSelectResult: (teacherId: number) => void;
}

const TeacherUnavailableResult = (props: ITeacherUnavailableResultProps) => {
	const { data, isLoading, handleDelete, handleSelectResult } = props;

	return (
		<div className='w-[40%] h-[90vh] px-[2vw] pt-[6vh] flex flex-col justify-start items-start gap-5'>
			<h1 className='text-title-small-strong h-[5vh] t'>Danh sách áp dụng</h1>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: '100%' }} aria-label='teacher table' size='small'>
					<TableHead>
						<TableRow>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								STT
							</TableCell>
							<TableCell align='left' sx={{ fontWeight: 'bold' }}>
								Tên giáo viên
							</TableCell>
							<TableCell align='center' sx={{ fontWeight: 'bold' }}>
								Hành động
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoading && data.length === 0 && (
							<>
								{[1, 2, 3, 4, 5].map((index) => (
									<TableRow key={index}>
										<TableCell align='center'>
											<Skeleton variant='text' animation='wave' />
										</TableCell>
										<TableCell align='left'>
											<Skeleton variant='text' animation='wave' />
										</TableCell>
										<TableCell align='center'>
											<IconButton
												color='error'
												// onClick={() => handleDelete(teacher['teacher-id'])}
											>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</>
						)}
						{!isLoading && data.length === 0 && (
							<TableRow>
								<TableCell align='center' colSpan={3}>
									<p className='text-body-small italic opacity-80'>
										Chưa có dữ liệu
									</p>
								</TableCell>
							</TableRow>
						)}
						{data.map((teacher, index) => (
							<TableRow
								key={index}
								sx={{ userSelect: 'none', cursor: 'pointer' }}
								onClick={() => handleSelectResult(teacher['teacher-id'])}
							>
								<TableCell align='center'>{index + 1}</TableCell>
								<TableCell align='left'>
									{`${teacher.teacherObject['first-name']} ${teacher.teacherObject['last-name']} (${teacher.teacherObject.abbreviation})`}
								</TableCell>
								<TableCell align='center'>
									<IconButton
										color='error'
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(teacher['teacher-id']);
										}}
									>
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TeacherUnavailableResult;
