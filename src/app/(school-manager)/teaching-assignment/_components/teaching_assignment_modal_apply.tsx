import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useNotify from '@/hooks/useNotify';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, Modal, styled, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useCheckAutoAssignAvailability from '../_hooks/useCheckAvailability';
import { getAutoAssignmentApi } from '../_libs/apis';
import {
	ENTITY_TARGET,
	ITeachingAssignmentAvailabilityResponse as ITAAvailabilityResponse,
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

const Div = styled('div')(({ theme }) => ({
	...theme.typography.button,
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(1),
}));

function findRemovedElements(oldArray: string[], newArray: string[]): string[] {
	const newSet = new Set(newArray);
	return oldArray.filter((item) => !newSet.has(item));
}

interface IApplyModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeachingAssignmentApplyModal = (props: IApplyModalProps) => {
	const { open, setOpen } = props;
	const { schoolId, selectedSchoolYearId, sessionToken } = useAppContext();
	const [errorObject, setErrorObject] = useState<ITAAvailabilityResponse | undefined>(undefined);

	// Object for saving errors that've been passed
	const [recoveredObjects, setRecoveredObjects] = useState<ITAAvailabilityResponse>(
		{} as ITAAvailabilityResponse
	);
	const [isAutomationAvaialable, setIsAutomationAvailable] = useState<boolean>(false);

	const { data, mutate, isValidating } = useCheckAutoAssignAvailability({
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		sessionToken,
		revalidate: !isAutomationAvaialable && open,
	});

	const handleAutoAssignment = async () => {
		const endpoint = getAutoAssignmentApi({
			schoolId: Number(schoolId),
			schoolYearId: selectedSchoolYearId,
		});
		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${sessionToken}`,
			},
		});
		const data = await response?.json();
		useNotify({
			message:
				response?.status === 200
					? 'Phân công tự động thành công'
					: 'Phân công tự động thất bại',
			type: response?.status === 200 ? 'success' : 'error',
		});
		if (data?.status === 400) {
			setErrorObject({ ...data.result } as ITAAvailabilityResponse);
		}
	};

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
			open={open}
			// onClose={handleClose}
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
				<div className='w-full h-fit max-h-[50vh] p-3 overflow-y-scroll no-scrollbar'>
					{isAutomationAvaialable && (
						<h2 className='text-body-large-strong font-normal w-full text-left py-5'>
							Phân công tự động cho toàn bộ giáo viên?
						</h2>
					)}
					{errorObject &&
						Object.entries(errorObject).map(([entity, errors], index) => (
							<div key={entity + index}>
								{errors.length > 0 && (
									<div>
										<h3 className='text-body-small italic opacity-80 py-2'>
											(*) Vui lòng sửa những lỗi sau để có thể tiến hành phân
											công tự động
										</h3>
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
																<h1 className='w-[80%]'>{error}</h1>
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
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3'
				>
					<ContainedButton
						title='phân công tự động'
						disableRipple
						type='button'
						disabled={!isAutomationAvaialable}
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleAutoAssignment}
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

export default TeachingAssignmentApplyModal;
