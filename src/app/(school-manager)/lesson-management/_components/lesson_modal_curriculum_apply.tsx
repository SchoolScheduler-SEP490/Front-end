import ContainedButton from '@/commons/button-contained';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Checkbox, Collapse, Divider, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';
import { ICurriculumSidenavData as ICurriculumData } from '../_libs/constants';
import QuickApplyConfirmationModal from './lesson_modal_apply_confirm';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '30vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ICurriclumApplyModalProps {
	handleConfirm: () => void;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	applicableCurriculum: ICurriculumData[];
	selectedCurriculumIds: number[];
	setSelectedCurriculumIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const CurriculumApplyModal = (props: ICurriclumApplyModalProps) => {
	const {
		handleConfirm,
		setOpen,
		open,
		applicableCurriculum,
		selectedCurriculumIds,
		setSelectedCurriculumIds,
	} = props;
	const [allSelected, setAllSelected] = React.useState<boolean>(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState<boolean>(false);

	const handleClose = () => {
		setOpen(false);
		setSelectedCurriculumIds([]);
		setAllSelected(false);
	};

	const handleConfirmApply = () => {
		setIsConfirmModalOpen(true);
	};

	const handleApplyConfirm = () => {
		handleConfirm();
		setOpen(false);
		setSelectedCurriculumIds([]);
		setAllSelected(false);
		setIsConfirmModalOpen(false);
	};

	const handleSelectCurriculum = (target: number) => {
		if (selectedCurriculumIds.includes(target)) {
			setSelectedCurriculumIds(selectedCurriculumIds.filter((item) => item !== target));
		} else {
			setSelectedCurriculumIds([...selectedCurriculumIds, target]);
		}
	};

	const handleSelectGrade = (targets: number[]) => {
		if (targets.filter((item) => !selectedCurriculumIds.includes(item)).length === 0) {
			setSelectedCurriculumIds(
				selectedCurriculumIds.filter((item) => !targets.includes(item))
			);
		} else {
			setSelectedCurriculumIds([...selectedCurriculumIds, ...targets]);
		}
	};

	const handleSelectAllCurriculum = () => {
		if (allSelected) {
			setSelectedCurriculumIds([]);
			setAllSelected(false);
		} else {
			const tmpSelected: number[] = [];
			applicableCurriculum.forEach((item) => {
				item.items.forEach((sub) => {
					tmpSelected.push(sub.value);
				});
			});
			setSelectedCurriculumIds(tmpSelected);
			setAllSelected(true);
		}
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='keep-mounted-modal-title'
			aria-describedby='keep-mounted-modal-description'
			disableEnforceFocus
			disableAutoFocus
			disableRestoreFocus
		>
			<Box sx={style}>
				<div
					id='modal-header'
					className='w-full h-fit flex flex-row justify-between items-center bg-basic-gray-hover p-3 py-1'
				>
					<Typography
						variant='h6'
						component='h2'
						className='text-title-medium-strong font-normal opacity-60'
					>
						Áp dụng Khung chương trình
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>

				<div className='w-full h-[50vh] px-3 relative overflow-y-scroll no-scrollbar'>
					{applicableCurriculum.length === 0 && (
						<h1 className='w-full text-left text-body-medium italic'>
							Chưa có khung chương trình áp dụng
						</h1>
					)}
					<div
						className='w-full bg-white z-10 sticky top-0 left-0  flex flex-row justify-start items-center select-none cursor-pointer border-b-1 border-basic-gray-active'
						onClick={handleSelectAllCurriculum}
					>
						<Checkbox checked={allSelected} color='primary' />
						<h2 className='text-body-large-strong'>Chọn tất cả</h2>
					</div>
					{applicableCurriculum.map((item: ICurriculumData, index: number) => (
						<div key={index} className='w-full flex flex-col justify-start items-start'>
							<Collapse in={true} timeout={200} sx={{ width: '100%' }}>
								<div
									className='w-full flex flex-row justify-start items-center select-none cursor-pointer hover:bg-basic-gray-hover'
									onClick={() =>
										handleSelectGrade(item.items.map((item) => item.value))
									}
								>
									<Checkbox
										checked={
											item.items.filter(
												(item) =>
													!selectedCurriculumIds.includes(item.value)
											).length === 0
										}
										color='primary'
									/>
									<h2 className='text-body-large-strong'>{item.title}</h2>
								</div>
							</Collapse>
							{item.items.map((sub) => (
								<Collapse in={true} timeout={200} sx={{ width: '100%' }}>
									<div
										className={`w-full flex flex-row justify-start items-center pl-[5%] select-none cursor-pointer hover:bg-basic-gray-hover`}
										onClick={() => handleSelectCurriculum(sub.value)}
									>
										<Checkbox
											checked={selectedCurriculumIds.includes(sub.value)}
											color='primary'
										/>
										<h2 className='text-body-medium-strong'>{sub.key}</h2>
									</div>
								</Collapse>
							))}
						</div>
					))}
				</div>
				<div
					id='modal-footer'
					className='w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover px-3 py-2'
				>
					<ContainedButton
						title='Huỷ'
						onClick={handleClose}
						disableRipple
						styles='!bg-basic-gray-active !text-basic-gray !py-1 px-3'
					/>
					<ContainedButton
						title='xác nhận'
						disableRipple
						disabled={selectedCurriculumIds.length === 0}
						type='button'
						styles='bg-primary-300 text-white !py-1 px-3'
						onClick={handleConfirmApply}
					/>
				</div>
				<QuickApplyConfirmationModal
					open={isConfirmModalOpen}
					setOpen={setIsConfirmModalOpen}
					handleConfirm={handleApplyConfirm}
				/>
			</Box>
		</Modal>
	);
};

export default CurriculumApplyModal;
