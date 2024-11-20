import useNotify from '@/hooks/useNotify';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

interface ITeacherUnavailableResultProps {
	data: any[];
}

const TeacherUnavailableResult = (props: ITeacherUnavailableResultProps) => {
	const { data } = props;

	const handleDelete = (id: number) => {
		useNotify({
			message: 'Xóa thành công',
			type: 'success',
		});
	};

	return (
		<div className='w-[40%] h-[90vh] px-[2vw] pt-[6vh] flex flex-col justify-start items-start gap-5'>
			<h1 className='text-title-small-strong h-[10vh] t'>Danh sách áp dụng</h1>
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
						{data.map((teacher, index) => (
							<TableRow key={teacher.id}>
								<TableCell align='center'>{index + 1}</TableCell>
								<TableCell align='left'>
									{teacher.name} ({teacher.username})
								</TableCell>
								<TableCell align='center'>
									<IconButton
										color='error'
										onClick={() => handleDelete(teacher.id)}
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
