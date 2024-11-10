import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { Dispatch } from 'react';
import { KeyedMutator } from 'swr';
import useCreateDepartment from '../_hooks/useCreateDepartment';
import { ICreateDepartmentRequest } from '../_libs/constants';
import { createDepartmentSchema } from '../_libs/schemas';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '70vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ICreateDepartmentProps {
	open: boolean;
	setOpen: Dispatch<React.SetStateAction<boolean>>;
	updateDepartment: KeyedMutator<any>;
}

const CreateDepartment = (props: ICreateDepartmentProps) => {
	const { schoolId, sessionToken } = useAppContext();
	const { open, setOpen, updateDepartment } = props;

	const handleFormSubmit = async (formData: ICreateDepartmentRequest) => {
		await useCreateDepartment({
			formData: [formData],
			schoolId: Number(schoolId),
			sessionToken,
		});
		updateDepartment();
		handleClose();
	};

	const handleClose = () => {
		formik.handleReset(formik.initialValues);
		setOpen(false);
	};

	const formik = useFormik({
		initialValues: {
			name: '',
			'department-code': '',
			description: '',
		} as ICreateDepartmentRequest,
		validationSchema: createDepartmentSchema,
		onSubmit: async (formData) => {
			// Add additional logic here
		},
		validateOnMount: true, // This will trigger validation on mount
	});

	return (
		<Modal
			keepMounted
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Thêm tổ bộ môn
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div>
					<div id='class-selector'></div>
				</div>
				<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
					<ContainedButton
						title='Thêm TBM'
						disableRipple
						disabled={!formik.isValid}
						styles='bg-primary-300 text-white !py-1 px-4'
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

export default CreateDepartment;
