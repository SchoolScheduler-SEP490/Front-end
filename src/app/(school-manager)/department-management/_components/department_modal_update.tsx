import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import Image from 'next/image';
import { Dispatch, useEffect } from 'react';
import { KeyedMutator } from 'swr';
import useUpdateDepartment from '../_hooks/useUpdateDepartment';
import { IDepartmentTableData, IUpdateDepartmentRequest } from '../_libs/constants';
import { createDepartmentSchema as departmentSchema } from '../_libs/schemas';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ICreateDepartmentProps {
	open: boolean;
	setOpen: Dispatch<React.SetStateAction<boolean>>;
	updateDepartment: KeyedMutator<any>;
	departmentData: IDepartmentTableData;
}

const UpdateDepartment = (props: ICreateDepartmentProps) => {
	const { schoolId, sessionToken } = useAppContext();
	const { open, setOpen, updateDepartment, departmentData } = props;

	const handleFormSubmit = async (formData: IUpdateDepartmentRequest) => {
		await useUpdateDepartment({
			departmentId: departmentData.departmentKey,
			formData: formData,
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
		} as IUpdateDepartmentRequest,
		validationSchema: departmentSchema,
		onSubmit: async (formData) => {
			// Add additional logic here
		},
		validateOnMount: true, // This will trigger validation on mount
	});

	useEffect(() => {
		if (departmentData) {
			formik.setValues({
				name: departmentData.departmentName,
				'department-code': departmentData.departmentCode,
				description: departmentData.description,
			} as IUpdateDepartmentRequest);
		}
	}, [departmentData, open]);

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
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Cập nhật tổ bộ môn
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<form
					onSubmit={(event: any) => {
						event.preventDefault();
						handleFormSubmit(formik.values);
					}}
					className='w-full h-fit flex flex-col justify-start items-center'
				>
					<div className='w-full p-3 flex flex-col justify-start items-center gap-3'>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start pt-4'>Tên tổ bộ môn</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								label='Nhập tên tổ bộ môn'
								id='name'
								name='name'
								autoFocus
								value={formik.values.name}
								onChange={formik.handleChange('name')}
								onBlur={formik.handleBlur}
								error={formik.touched.name && Boolean(formik.errors.name)}
								helperText={formik.touched.name && formik.errors.name}
								slotProps={{
									input: {
										endAdornment: (
											<Image
												className='opacity-30 mx-2 select-none'
												src='/images/icons/text-formatting.png'
												alt='email'
												width={20}
												height={20}
											/>
										),
									},
								}}
							/>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start pt-4'>Mã tổ bộ môn</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								label='Nhập mã tổ bộ môn'
								id='department-code'
								name='department-code'
								autoFocus
								value={formik.values['department-code']}
								onChange={formik.handleChange('department-code')}
								onBlur={formik.handleBlur}
								error={
									formik.touched['department-code'] &&
									Boolean(formik.errors['department-code'])
								}
								helperText={
									formik.touched['department-code'] &&
									formik.errors['department-code']
								}
								slotProps={{
									input: {
										endAdornment: (
											<Image
												className='opacity-30 mx-2 select-none'
												src='/images/icons/text-formatting.png'
												alt='email'
												width={20}
												height={20}
											/>
										),
									},
								}}
							/>
						</div>
						<div className='w-full h-fit flex flex-row justify-between items-center'>
							<h3 className=' h-full flex justify-start pt-4'>Mô tả</h3>
							<TextField
								className='w-[70%]'
								variant='standard'
								label='Nhập mô tả'
								id='description'
								name='description'
								autoFocus
								value={formik.values.description}
								onChange={formik.handleChange('description')}
								onBlur={formik.handleBlur}
								error={
									formik.touched.description && Boolean(formik.errors.description)
								}
								helperText={formik.touched.description && formik.errors.description}
								slotProps={{
									input: {
										endAdornment: (
											<Image
												className='opacity-30 mx-2 select-none'
												src='/images/icons/text-formatting.png'
												alt='email'
												width={20}
												height={20}
											/>
										),
									},
								}}
							/>
						</div>
					</div>
					<div className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'>
						<ContainedButton
							title='Cập nhật TBM'
							disableRipple
							type='submit'
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
				</form>
			</Box>
		</Modal>
	);
};

export default UpdateDepartment;
