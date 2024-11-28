import DeleteIcon from '@mui/icons-material/Delete';
import {
	Button,
	Collapse,
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
import { usePathname, useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ITeacherUnavailableResultProps {
	data: ITeacherUnavailability[];
	isLoading: boolean;
	handleDelete: (teacherId: number) => void;
	handleSelectResult: (teacherId: number) => void;
}

const TeacherUnavailableResult = (props: ITeacherUnavailableResultProps) => {
	const { data, isLoading, handleDelete, handleSelectResult } = props;
	const router = useRouter();
	const pathName = usePathname();

	const handleNext = () => {
		const tmpPathArr: string[] = pathName.split('/');
		tmpPathArr.splice(4);
		tmpPathArr.push('free-timetable-periods');
		router.push(tmpPathArr.join('/'));
	};

	return (
		<div className='w-[40%] h-[90vh] px-[2vw] pt-[6vh] flex flex-col justify-start items-start gap-5'>
			<div className='w-full h-fit flex flex-row justify-between items-baseline'>
				<h1 className='text-title-small-strong h-[5vh] align-text-bottom'>kết quả</h1>
				<Collapse
					in={data.length > 0}
					orientation='horizontal'
					sx={{
						width: data.length > 0 ? '60%' : '0%',
						height: 'fit-content',
						p: 0,
						m: 0,
					}}
				>
					<Button
						variant='outlined'
						onClick={handleNext}
						color='success'
						sx={{
							borderRadius: 0,
							width: '100%',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							textWrap: 'nowrap',
							borderBottom: '2px solid #008000',
						}}
						endIcon={<ArrowForwardIcon />}
					>
						xếp tiết nghỉ
					</Button>
				</Collapse>
			</div>
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
