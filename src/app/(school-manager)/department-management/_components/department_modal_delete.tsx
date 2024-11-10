import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import { ICommonResponse } from '@/utils/constants';
import { TRANSLATOR } from '@/utils/dictionary';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { KeyedMutator } from 'swr';
import { getDeleteDepartmentApi } from '../_libs/apis';

const style = {
	position: 'absolute',
	top: '40%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ISubjectDeleteModalProps {
	open: boolean;
	setOpen: (status: boolean) => void;
	departmentName: string;
	departmentId: number;
	mutate: KeyedMutator<any>;
}

const DeleteDepartmentModal = (props: ISubjectDeleteModalProps) => {
	const { open, setOpen, departmentName, departmentId, mutate } = props;
	const { sessionToken, schoolId } = useAppContext();

	const handleClose = () => {
		setOpen(false);
	};

	const handleDeleteSubject = async () => {
		const endpoint = getDeleteDepartmentApi({
			departmentId,
			schoolId: Number(schoolId),
		});
		// Neeeds updating
		const response = await fetch(endpoint, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data: ICommonResponse<any> = await response.json();
		if (data.status !== 200) {
			useNotify({
				message: TRANSLATOR[data.message ?? ''] ?? 'Có lỗi xảy ra',
				type: 'error',
			});
			return;
		} else {
			await mutate();
			useNotify({
				message: TRANSLATOR[data.message ?? ''] ?? 'Xóa Tổ bộ môn thành công',
				type: 'success',
			});
		}
		handleClose();
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center p-2 pl-5'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-large-strong font-semibold'
					>
						Xóa tổ bộ môn
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='p-4 pl-5'>
					<Typography className='text-title-small-strong'>
						Bạn có chắc muốn xóa <strong>{departmentName}</strong>?
					</Typography>
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Xóa tổ hợp'
						disableRipple
						onClick={handleDeleteSubject}
						styles='bg-red-200 text-basic-negative text-normal !py-1 px-4'
					/>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default DeleteDepartmentModal;
