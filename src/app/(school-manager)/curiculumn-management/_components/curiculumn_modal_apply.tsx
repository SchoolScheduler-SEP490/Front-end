import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	Checkbox,
	Collapse,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Modal,
	styled,
	Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import useFetchCurriculumClass from '../_hooks/useFetchClass';
import { IApplyCurriculumRequest, ISGClassResponse, IVulnerableClass } from '../_libs/constants';
import ApllyConfirmationModal from './curiculumn_modal_confirm';
import useApplyCurriculum from '../_hooks/useApplyCurriculum';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '40vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface ISGApplyModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	grade: string;
	subjectGroupName: string;
	subjectGroupId: number;
}

const ApplyCurriculumModal = (props: ISGApplyModalProps) => {
	const { open, setOpen, grade, subjectGroupName, subjectGroupId } = props;
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const { data, isValidating, error, mutate } = useFetchCurriculumClass({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: selectedSchoolYearId,
		grade,
	});

	const [selectedClasses, setSelectedClasses] = useState<ISGClassResponse[]>([]);
	const [vulnerableClasses, setVulnerableClasses] = useState<IVulnerableClass[]>([]);
	const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

	useEffect(() => {
		// Data handling logics here
	}, [data, open]);

	const handleClose = () => {
		setOpen(false);
		setSelectedClasses([]);
	};

	const handleUpdateSubmit = async () => {
		await useApplyCurriculum({
			sessionToken: sessionToken,
			schoolId: Number(schoolId),
			schoolYearId: selectedSchoolYearId,
			formData: {
				'class-ids': selectedClasses.map((item) => item.id),
				'subject-group-id': subjectGroupId,
			} as IApplyCurriculumRequest,
		});
		handleClose();
		setIsConfirmOpen(false);
	};

	const handleConfirmApply = () => {
		if (selectedClasses.length > 0) {
			var tmpVulClasses: IVulnerableClass[] = [];
			selectedClasses.map((item) => {
				if (item['subject-group-id'] !== null) {
					tmpVulClasses.push({
						className: item.name,
						existingGroupName: item['subject-group-name'],
					});
				}
			});
			setVulnerableClasses(tmpVulClasses);
		}
		setIsConfirmOpen(true);
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
					className='w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3 py-2'
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
				<div className='w-full h-[40vh] p-3'></div>
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
						title='áp dụng'
						disableRipple
						type='button'
						disabled={selectedClasses.length === 0}
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleConfirmApply}
					/>
				</div>
				<ApllyConfirmationModal
					open={isConfirmOpen}
					setOpen={setIsConfirmOpen}
					vulnerableClasses={vulnerableClasses}
					newCurriculum={subjectGroupName}
					handleConfirm={handleUpdateSubmit}
				/>
			</Box>
		</Modal>
	);
};

export default ApplyCurriculumModal;
