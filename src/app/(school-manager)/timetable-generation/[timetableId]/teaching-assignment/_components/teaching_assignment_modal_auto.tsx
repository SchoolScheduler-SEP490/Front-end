'use client';
import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
	Box,
	CircularProgress,
	circularProgressClasses,
	Divider,
	IconButton,
	Modal,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IConfigurationStoreObject } from '../../../_libs/constants';
import useCheckAutoAssignAvailability from '../_hooks/useCheckAvailability';
import { getAutoAssignmentApi } from '../_libs/apis';
import {
	ENTITY_TARGET,
	IAutoTeacherAssignmentResponse,
	IAutoTeacherAssingmentRequest,
	ITeachingAssignmentAvailabilityResponse as ITAAvailabilityResponse,
	ITeacherAssignmentRequest,
} from '../_libs/constants';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

function findRemovedElements(oldArray: string[], newArray: string[]): string[] {
	const newSet = new Set(newArray);
	return oldArray.filter((item) => !newSet.has(item));
}

interface IApplyModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setAutomationResult: React.Dispatch<React.SetStateAction<IAutoTeacherAssignmentResponse[]>>;
	setModifyingResultModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
	assignedTeachers: ITeacherAssignmentRequest[];
	dataStored: IConfigurationStoreObject;
	minPeriodPerWeek: number;
	maxPeriodPerWeek: number;
}

const TeachingAssignmentAutoApplyModal = (props: IApplyModalProps) => {
	const {
		open,
		setOpen,
		setAutomationResult,
		setModifyingResultModalOpen,
		assignedTeachers,
		dataStored,
		maxPeriodPerWeek,
		minPeriodPerWeek,
	} = props;
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
	const [errorObject, setErrorObject] = useState<ITAAvailabilityResponse | undefined>(undefined);

	const [autoParams, setAutoParams] = useState<IAutoTeacherAssingmentRequest>({
		'max-periods-per-week': 0,
		'min-periods-per-week': 0,
		'fixed-assignment': null,
		'class-combinations': null,
	});
	const [isValidating, setIsValidating] = useState<boolean>(false);

	// Object for saving errors that've been passed
	const [recoveredObjects, setRecoveredObjects] = useState<ITAAvailabilityResponse>(
		{} as ITAAvailabilityResponse
	);
	const [isAutomationAvaialable, setIsAutomationAvailable] = useState<boolean>(false);

	const { data } = useCheckAutoAssignAvailability({
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		sessionToken,
		revalidate: !isAutomationAvaialable && open,
		body: autoParams,
	});

	const handleAutoAssignment = async () => {
		setIsValidating(true);
		const endpoint = getAutoAssignmentApi({
			schoolId: Number(schoolId),
			schoolYearId: selectedSchoolYearId,
		});
		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(autoParams),
		});
		const data = await response?.json();
		if (data?.status === 200) {
			setAutomationResult(data.result as IAutoTeacherAssignmentResponse[]);
			setModifyingResultModalOpen(true);
			handleClose();
			useNotify({
				message:
					response.status === 200
						? 'Phân công tự động thành công'
						: 'Phân công tự động thất bại',
				type: response.status === 200 ? 'success' : 'error',
			});
		}
		if (data?.status === 400) {
			setErrorObject({ ...data.result } as ITAAvailabilityResponse);
			useNotify({
				message: 'Phân công tự động thất bại',
				type: 'error',
			});
		}
		setIsValidating(false);
	};

	useEffect(() => {
		if (dataStored) {
			const tmpAutoParams: IAutoTeacherAssingmentRequest = {
				'max-periods-per-week': maxPeriodPerWeek,
				'min-periods-per-week': minPeriodPerWeek,
				'fixed-assignment':
					assignedTeachers.length > 0
						? assignedTeachers.map((teacher) => ({
								'assignment-id': teacher.id,
								'teacher-id': teacher['teacher-id'],
						  }))
						: null,
				'class-combinations':
					dataStored['class-combinations'].length > 0
						? dataStored['class-combinations']
						: null,
			};
			setAutoParams(tmpAutoParams);
		}
	}, [assignedTeachers, dataStored, maxPeriodPerWeek, minPeriodPerWeek]);

	useEffect(() => {
		if (open) {
			if (data?.status === 400) {
				const newErrorObject: ITAAvailabilityResponse = { ...data.result };
				if (!errorObject) {
					setErrorObject(newErrorObject);
				} else {
					Object.entries(newErrorObject).forEach(
						([entity, errors]: [string, string[]]) => {
							if (errorObject[entity as keyof ITAAvailabilityResponse]) {
								const newErrors: string[] = errors.filter(
									(error) =>
										!errorObject[
											entity as keyof ITAAvailabilityResponse
										].includes(error)
								);
								// In case of creating new errors
								if (newErrors.length > 0) {
									setErrorObject((prev) => {
										if (!prev) return prev;
										return {
											...prev,
											[entity as keyof ITAAvailabilityResponse]: [
												...prev[entity as keyof ITAAvailabilityResponse],
												...newErrors,
											],
										};
									});
								}
								// For case of having removed some errors
								const removedErrors = findRemovedElements(
									errorObject[entity as keyof ITAAvailabilityResponse],
									errors
								);
								if (removedErrors.length > 0) {
									setRecoveredObjects((prev: ITAAvailabilityResponse) => ({
										...prev,
										[entity as keyof ITAAvailabilityResponse]: removedErrors,
									}));
								}
							}
						}
					);
				}
			} else if (data?.status === 200) {
				setIsAutomationAvailable(true);
				setErrorObject(undefined);
				setRecoveredObjects({} as ITAAvailabilityResponse);
			}
		}
	}, [data, open]);

	const handleClose = () => {
		setOpen(false);
		setErrorObject(undefined);
		setRecoveredObjects({} as ITAAvailabilityResponse);
	};

	return (
		<Modal
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
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
						Phân công tự động
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				{isValidating ? (
					<div className='w-full h-fit max-h-[50vh] p-3 flex justify-center items-center overflow-y-scroll no-scrollbar'>
						<Box sx={{ position: 'relative' }}>
							<CircularProgress
								variant='determinate'
								sx={(theme) => ({
									color: theme.palette.grey[200],
									...theme.applyStyles('dark', {
										color: theme.palette.grey[800],
									}),
								})}
								size={40}
								thickness={4}
								{...props}
								value={100}
							/>
							<CircularProgress
								variant='indeterminate'
								disableShrink
								sx={(theme) => ({
									color: '#004e89',
									animationDuration: '550ms',
									position: 'absolute',
									left: 0,
									[`& .${circularProgressClasses.circle}`]: {
										strokeLinecap: 'round',
									},
									...theme.applyStyles('dark', {
										color: '#308fe8',
									}),
								})}
								size={40}
								thickness={4}
								{...props}
							/>
						</Box>
					</div>
				) : (
					<div className='w-full h-fit max-h-[50vh] p-3 overflow-y-scroll no-scrollbar'>
						{isAutomationAvaialable && (
							<div className='w-full h-full flex flex-col justify-center items-start'>
								<h2 className='text-body-large-strong font-normal w-full text-left py-5'>
									Phân công tự động cho toàn bộ giáo viên?
								</h2>
								<p className='text-body-small italic opacity-60 text-basic-positive'>
									(*) Đã đủ điều kiện thể tiến hành phân công tự động
								</p>
							</div>
						)}
						{errorObject && (
							<div className='w-full h-full flex-col justify-center items-start'>
								<p className='text-body-small italic opacity-60 text-basic-gray py-1'>
									(*) Vui lòng sửa những lỗi sau trước khi thực hiện phân công tự
									động
								</p>
								{Object.entries(errorObject).map(([entity, errors], index) => (
									<div key={entity + index}>
										{errors.length > 0 && (
											<div>
												<div className='w-full flex flex-row justify-between items-baseline'>
													<h3 className='text-body-large-strong font-medium'>
														{entity}
													</h3>
													<a
														href={ENTITY_TARGET[entity]}
														target='_blank'
														rel='noopener noreferrer'
														className='flex flex-row justify-end items-center text-body-medium font-normal opacity-80 text-primary-500'
													>
														Sửa lỗi {entity}
														<ArrowOutwardIcon
															color='inherit'
															sx={{ fontSize: 18, opacity: 0.8 }}
														/>
													</a>
												</div>
												<ul className='list-disc pl-5 pb-3'>
													{errors.map((error: string, index: number) => (
														<>
															{recoveredObjects &&
															recoveredObjects[
																entity as keyof ITAAvailabilityResponse
															]?.includes(error) ? (
																// Success case
																<li
																	key={error + index}
																	className='text-body-small font-regular py-1 text-basic-positive'
																>
																	<div className='w-[90%] flex flex-row justify-between items-stretch'>
																		<h1 className='w-[80%]'>
																			{error}
																		</h1>
																		<CheckIcon
																			color='success'
																			fontSize='small'
																		/>
																	</div>
																</li>
															) : (
																// Error case
																<li
																	key={index}
																	className='text-body-small font-regular py-1 text-basic-negative'
																>
																	<div className='w-[90%] flex flex-row justify-between items-stretch'>
																		<h1>{error}</h1>
																		<CloseIcon
																			color='error'
																			fontSize='small'
																		/>
																	</div>
																</li>
															)}
														</>
													))}
												</ul>
												<Divider variant='middle' />
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-4'
					/>
					<ContainedButton
						title='phân công tự động'
						disableRipple
						type='button'
						disabled={!isAutomationAvaialable}
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleAutoAssignment}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default TeachingAssignmentAutoApplyModal;
