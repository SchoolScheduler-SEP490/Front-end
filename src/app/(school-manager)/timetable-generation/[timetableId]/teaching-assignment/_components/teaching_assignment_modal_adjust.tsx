'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import { useSMDispatch } from '@/hooks/useReduxStore';
import { ITeachingAssignmentObject } from '@/utils/constants';
import { firestore } from '@/utils/firebaseConfig';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Box, IconButton, Modal, styled, TextField, Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { KeyedMutator } from 'swr';
import useFetchTeachableTeacher from '../_hooks/useFetchTeachableTeacher';
import {
	IAssignmentResponse,
	IAutoTeacherAssignmentResponse,
	ITeachableResponse,
	ITeachingAssignmentSidenavData,
} from '../_libs/constants';
import TeachingAssignmentSideNav from './teaching_assignment_sidenav';

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&::before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.5rem', border: 'none' }} />}
		{...props}
	/>
))(({ theme }) => ({
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1.5),
	},
	...theme.applyStyles('dark', {
		backgroundColor: 'rgba(255, 255, 255, .05)',
	}),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	width: '100%',
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50vw',
	height: 'fit-content',
	bgcolor: 'background.paper',
};

interface IExtendedTeachingAssignment extends ITeachingAssignmentObject {
	'teacher-name': string;
}

const renderTeacherOption = (assignment: IAssignmentResponse): IDropdownOption<number> => {
	return {
		label: `${assignment['teacher-last-name']} ${assignment['teacher-first-name']} (${assignment['teacher-abbreviation']})`,
		value: assignment['teacher-id'],
	} as IDropdownOption<number>;
};

const renderSelectedOption = (assignment: IExtendedTeachingAssignment): IDropdownOption<number> => {
	return {
		label: assignment['teacher-name'],
		value: assignment['teacher-id'],
	} as IDropdownOption<number>;
};

interface IApplyModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	automationResult: IAutoTeacherAssignmentResponse[];
	sidenavData: ITeachingAssignmentSidenavData[];
	updateTeachingAssignment: KeyedMutator<any>;
	selectedGrade: string;
	setSelectedGrade: React.Dispatch<React.SetStateAction<string>>;
}

const TeachingAssignmentAdjustModal = (props: IApplyModalProps) => {
	const {
		open,
		setOpen,
		automationResult,
		sidenavData,
		updateTeachingAssignment,
		selectedGrade,
		setSelectedGrade,
	} = props;
	const { schoolId, sessionToken } = useAppContext();
	const { dataStored, dataFirestoreName, timetableStored }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useSMDispatch();

	const [editingObjects] = useState<IExtendedTeachingAssignment[]>([]);
	const [selectedAssignments, setSelectedAssignments] = useState<IAssignmentResponse[]>([]);
	const [teachableDropdown, setTeachableDropdown] = useState<IDropdownOption<number>[]>([]);

	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [selectedCurriculumName, setSelectedCurriculumName] = useState<string>('');
	const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);

	const { data: teachableData, mutate: getTeachableData } = useFetchTeachableTeacher({
		schoolId: Number(schoolId),
		subjectId: selectedSubjectId,
		sessionToken,
		grade: selectedGrade,
	});

	const handleSaveUpdates = async () => {
		// Save data to Firebase
		const originAutoResult: ITeachingAssignmentObject[] = [];
		automationResult.map((item) => {
			if (item['term-id'] === timetableStored['term-id']) {
				item.assignments.map((assignment) => {
					originAutoResult.push({
						'assignment-id': assignment.id,
						'teacher-id': assignment['teacher-id'],
					} as ITeachingAssignmentObject);
				});
			}
		});
		if (dataStored && dataFirestoreName && dataStored.id && automationResult.length > 0) {
			const finalResult: ITeachingAssignmentObject[] = useFilterArray(
				[
					...originAutoResult,
					...editingObjects.map(
						(obj) =>
							({
								'assignment-id': obj['assignment-id'],
								'teacher-id': obj['teacher-id'],
							} as ITeachingAssignmentObject)
					),
				],
				['assignment-id']
			);
			const docRef = doc(firestore, dataFirestoreName, dataStored.id);
			await setDoc(
				docRef,
				{
					...dataStored,
					'teacher-assignments': finalResult,
				},
				{ merge: true }
			);
			dispatch(updateDataStored({ target: 'teacher-assignments', value: finalResult }));
			useNotify({ message: 'Phân công giáo viên thành công', type: 'success' });
			updateTeachingAssignment();
			handleClose();
		}
	};

	// Lấy dữ liệu mặc định khi mở modal
	useEffect(() => {
		if (open && sidenavData.length > 0) {
			setSelectedClassId(sidenavData[0].items[0].value);
			setSelectedCurriculumName(sidenavData[0].items[0].extra);
		}
	}, [automationResult]);

	// Lấy dữ liệu phân công giáo viên theo lớp đã chọn
	useEffect(() => {
		if (open && automationResult.length > 0) {
			const currentTermAssignments: IAssignmentResponse[] | undefined = automationResult.find(
				(item) => item['term-id'] === timetableStored['term-id']
			)?.assignments;
			if (currentTermAssignments && currentTermAssignments.length > 0) {
				const currentClassAssignment: IAssignmentResponse[] = currentTermAssignments.filter(
					(item) => item['student-class-id'] === selectedClassId
				);
				if (currentClassAssignment.length > 0) {
					setSelectedAssignments(currentClassAssignment);
				}
			}
		}
	}, [selectedClassId, automationResult]);

	useEffect(() => {
		if (teachableData?.status === 200) {
			const dropdownOptions: IDropdownOption<number>[] = teachableData.result.map(
				(item: ITeachableResponse) => {
					return {
						value: item['teacher-id'],
						label: `${item['teacher-name']} (${item['teacher-abreviation']})`,
					} as IDropdownOption<number>;
				}
			);
			setTeachableDropdown([...useFilterArray(dropdownOptions, ['value'])]);
		}
	}, [teachableData, selectedSubjectId]);

	const handleUpdateTeacher = (assignmentId: number, teacherId: number, teacherName: string) => {
		const editIndex = editingObjects.findIndex((obj) => obj['assignment-id'] === assignmentId);
		if (editIndex !== -1) {
			editingObjects[editIndex] = {
				'assignment-id': assignmentId,
				'teacher-id': teacherId,
				'teacher-name': teacherName,
			} as IExtendedTeachingAssignment;
		} else {
			editingObjects.push({
				'assignment-id': assignmentId,
				'teacher-id': teacherId,
				'teacher-name': teacherName,
			} as IExtendedTeachingAssignment);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSelectSubject = (subjectId: number) => {
		setSelectedSubjectId(subjectId);
		getTeachableData({ subjectId: selectedSubjectId });
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
						Kết quả phân công
					</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</div>
				<div className='w-full h-[60vh] max-h-[60vh] overflow-y-scroll no-scrollbar flex flex-row justify-start items-start'>
					<TeachingAssignmentSideNav
						selectedClass={selectedClassId}
						setSelectedClass={setSelectedClassId}
						setSelectedCurriculumName={setSelectedCurriculumName}
						classData={sidenavData}
						setSelectedGrade={setSelectedGrade}
					/>
					<div className='w-full h-[60vh] pb-[1px] flex flex-col justify-start items-center overflow-y-scroll no-scrollbar'>
						{selectedAssignments.map((assignment: IAssignmentResponse) => {
							const editedObject = editingObjects.find(
								(obj) => obj['assignment-id'] === assignment.id
							);
							return (
								<div className='w-full h-fit py-2 px-[1vw] border-b-1 border-basic-gray-active flex flex-row justify-between items-center'>
									<h1 className='text-body-medium font-normal'>
										{assignment['subject-name']}
										<span className='text-body-small pl-1 opacity-80'>
											({assignment['period-count']} tiết)
										</span>
									</h1>

									<Autocomplete
										options={teachableDropdown}
										getOptionLabel={(option: IDropdownOption<number>) => option.label}
										getOptionKey={(option: IDropdownOption<number>) => option.value}
										noOptionsText='Không có giáo viên phù hợp'
										disableClearable
										value={
											editedObject
												? renderSelectedOption(editedObject)
												: renderTeacherOption(assignment)
										}
										onOpen={() => {
											handleSelectSubject(assignment['subject-id']);
										}}
										onBlur={() => {
											setTeachableDropdown([]);
										}}
										onChange={(event: any, newValue: IDropdownOption<number> | null) => {
											if (newValue !== null) {
												handleUpdateTeacher(assignment.id, newValue.value, newValue.label);
											}
										}}
										blurOnSelect
										renderInput={(params) => <TextField {...params} variant='standard' />}
										sx={{ width: '50%' }}
									/>
								</div>
							);
						})}
					</div>
				</div>
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
						title='áp dụng phân công'
						disableRipple
						type='button'
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleSaveUpdates}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default TeachingAssignmentAdjustModal;
