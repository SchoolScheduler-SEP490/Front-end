'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import ContainedButton from '@/commons/button-contained';
import { useAppContext } from '@/context/app_provider';
import useFilterArray from '@/hooks/useFilterArray';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Box, IconButton, Modal, styled, TextField, Typography } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import React, { useEffect, useState } from 'react';
import { IConfigurationStoreObject, ITeachingAssignmentObject } from '../../../_libs/constants';
import useFetchTeachableTeacher from '../_hooks/useFetchTeachableTeacher';
import {
	IAssignmentResponse,
	IAutoTeacherAssignmentResponse,
	ITeachableResponse,
	ITeachingAssignmentSidenavData,
} from '../_libs/constants';
import TeachingAssignmentSideNav from './teaching_assignment_sidenav';
import { ITimetableGenerationState, updateDataStored } from '@/context/slice_timetable_generation';
import { useSelector } from 'react-redux';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/utils/firebaseConfig';
import { useSMDispatch } from '@/hooks/useStore';
import useNotify from '@/hooks/useNotify';
import { KeyedMutator } from 'swr';

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

interface ITermSeperatedAssignment {
	termId: number;
	termName: string;
	assignments: IAssignmentResponse[];
}

const renderTeacherOption = (assignment: IAssignmentResponse): IDropdownOption<number> => {
	return {
		label: `${assignment['teacher-first-name']} ${assignment['teacher-last-name']} (${assignment['teacher-abbreviation']})`,
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
	const { schoolId, sessionToken, selectedSchoolYearId } = useAppContext();
	const { dataStored, dataFirestoreName }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);
	const dispatch = useSMDispatch();

	const [editingObjects, setEditingObjects] = useState<ITeachingAssignmentObject[]>([]);
	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [selectedAssignments, setSelectedAssignments] = useState<ITermSeperatedAssignment[]>([]);
	const [selectedCurriculumName, setSelectedCurriculumName] = useState<string>('');
	const [expanded, setExpanded] = useState<string[]>(['panel0', 'panel1']);
	const [teachableDropdown, setTeachableDropdown] = useState<IDropdownOption<number>[]>([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);

	const { data: teachableData, mutate: getTeachableData } = useFetchTeachableTeacher({
		schoolId: Number(schoolId),
		subjectId: selectedSubjectId,
		sessionToken,
		grade: selectedGrade,
	});

	const handleSaveUpdates = async () => {
		// Save data to Firebase
		if (dataStored && dataFirestoreName && dataStored.id) {
			const docRef = doc(firestore, dataFirestoreName, dataStored.id);
			await setDoc(
				docRef,
				{
					...dataStored,
					'teacher-assignments': editingObjects,
				} as IConfigurationStoreObject,
				{ merge: true }
			);
			dispatch(updateDataStored({ target: 'teacher-assignments', value: editingObjects }));
			useNotify({ message: 'Phân công giáo viên thành công', type: 'success' });
			updateTeachingAssignment();
			handleClose();
		}
	};

	// Data chuẩn để lưu vào Firebase
	useEffect(() => {
		if (open && automationResult.length > 0) {
			var tmpTeachingAssignmentObjs: ITeachingAssignmentObject[] = [];
			automationResult.map((item: IAutoTeacherAssignmentResponse) => {
				tmpTeachingAssignmentObjs = [
					...tmpTeachingAssignmentObjs,
					...item.assignments.map(
						(ass) =>
							({
								id: ass.id,
								'teacher-id': ass['teacher-id'],
							} as ITeachingAssignmentObject)
					),
				];
			});
			if (tmpTeachingAssignmentObjs.length > 0) {
				setEditingObjects(tmpTeachingAssignmentObjs);
			}
		}
	}, [automationResult, open]);

	// Lấy dữ liệu mặc định khi mở modal
	useEffect(() => {
		if (open && sidenavData.length > 0) {
			setSelectedClassId(sidenavData[0].items[0].value);
			setSelectedCurriculumName(sidenavData[0].items[0].extra);
		}
	}, [open]);

	// Lấy dữ liệu phân công giáo viên theo lớp đã chọn
	useEffect(() => {
		if (open && automationResult.length > 0) {
			const tmpCurrentAssignments: ITermSeperatedAssignment[] = automationResult.map(
				(item: IAutoTeacherAssignmentResponse) =>
					({
						termId: item['term-id'],
						termName: item['term-name'],
						assignments: item.assignments.filter(
							(ass: IAssignmentResponse) =>
								ass['student-class-id'] === selectedClassId
						),
					} as ITermSeperatedAssignment)
			);
			if (tmpCurrentAssignments.length > 0) {
				setSelectedAssignments(tmpCurrentAssignments);
			}
		}
	}, [selectedClassId, open]);

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

	const handleUpdateTeacher = (assignmentId: number, teacherId: number) => {
		const updatedObjects = editingObjects.map((obj: ITeachingAssignmentObject) => {
			if (obj.id === assignmentId) {
				return {
					...obj,
					'teacher-id': teacherId,
				};
			}
			return obj;
		});
		setEditingObjects(updatedObjects);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const toggleDropdown =
		(panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
			if (newExpanded) {
				setExpanded((prev: string[]) => [...prev, panel]);
			} else {
				setExpanded((prev: string[]) => prev.filter((item) => item !== panel));
			}
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
						{selectedAssignments.map(
							(item: ITermSeperatedAssignment, index: number) => (
								<Accordion
									expanded={expanded.includes(`panel${index}`)}
									onChange={toggleDropdown(`panel${index}`)}
									className='w-full p-0 m-0'
									key={index}
								>
									<AccordionSummary
										aria-controls={`panel${index}d-content`}
										id={`panel${index}d-header`}
										className='!text-black !bg-basic-gray-hover'
									>
										<Typography fontSize={15}>{item.termName}</Typography>
									</AccordionSummary>
									<AccordionDetails className='w-full p-0 px-2'>
										{item.assignments.map((assignment: IAssignmentResponse) => (
											<div className='w-full h-fit py-2 border-b-1 border-basic-gray-active flex flex-row justify-between items-center'>
												<h1 className='text-body-medium font-normal'>
													{assignment['subject-name']}
												</h1>
												<Autocomplete
													options={teachableDropdown}
													getOptionLabel={(
														option: IDropdownOption<number>
													) => option.label}
													getOptionKey={(
														option: IDropdownOption<number>
													) => option.value}
													noOptionsText='Không có giáo viên phù hợp'
													disableClearable
													defaultValue={renderTeacherOption(assignment)}
													onOpen={() => {
														handleSelectSubject(
															assignment['subject-id']
														);
													}}
													onBlur={() => {
														setTeachableDropdown([]);
													}}
													onChange={(
														event: any,
														newValue: IDropdownOption<number> | null
													) => {
														if (newValue !== null) {
															handleUpdateTeacher(
																assignment.id,
																newValue.value
															);
														}
													}}
													blurOnSelect
													renderInput={(params) => (
														<TextField {...params} variant='standard' />
													)}
													sx={{ width: '50%' }}
												/>
											</div>
										))}
									</AccordionDetails>
								</Accordion>
							)
						)}
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
						disabled={editingObjects.length === 0}
						styles='bg-primary-300 text-white !py-1 px-4'
						onClick={handleSaveUpdates}
					/>
				</div>
			</Box>
		</Modal>
	);
};

export default TeachingAssignmentAdjustModal;
