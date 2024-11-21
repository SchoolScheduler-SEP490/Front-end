'use client';
import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';
import { useAppContext } from '@/context/app_provider';
import useFetchTerm from '@/hooks/useFetchTerm';
import useFilterArray from '@/hooks/useFilterArray';
import useNotify from '@/hooks/useNotify';
import { useEffect, useState } from 'react';
import TeachingAssignmentFilterableSkeleton from './_components/skeleton_filterable';
import TeachingAssignmentSideNavSkeleton from './_components/skeleton_sidenav';
import TeachingAssignmentTableSkeleton from './_components/skeleton_table';
import TeachingAssignmentFilterable from './_components/teaching_assignment_filterable';
import TeachingAssignmentAdjustModal from './_components/teaching_assignment_modal_adjust';
import TeachingAssignmentAutoApplyModal from './_components/teaching_assignment_modal_auto';
import TeachingAssignmentSideNav from './_components/teaching_assignment_sidenav';
import TeachingAssignmentTable from './_components/teaching_assignment_table';
import useFetchClassData from './_hooks/useFetchClass';
import useFetchTeachingAssignment from './_hooks/useFetchTA';
import useFetchTeacher from './_hooks/useFetchTeacher';
import useSidenavDataConverter from './_hooks/useSidenavDataConverter';
import {
	IAutoTeacherAssignmentResponse,
	IClassResponse,
	ITeacherAssignmentRequest,
	ITeacherResponse,
	ITeachingAssignmentResponse,
	ITeachingAssignmentSidenavData,
	ITeachingAssignmentTableData,
	ITermResponse,
} from './_libs/constants';
import { ITimetableGenerationState } from '@/context/slice_timetable_generation';
import { useSelector } from 'react-redux';

interface ISortableDropdown<T> extends IDropdownOption<T> {
	criteria: string | number;
}
export default function SMTeachingAssignment() {
	const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
	const { dataStored }: ITimetableGenerationState = useSelector(
		(state: any) => state.timetableGeneration
	);

	// Selected
	const [selectedClassId, setSelectedClassId] = useState<number>(0);
	const [selectedCurriculumName, setSelectedCurriculumName] = useState<string>('');
	const [selectedTermId, setSelectedTermId] = useState<number>(1);

	// Data
	const [tableData, setTableData] = useState<ITeachingAssignmentTableData[]>([]);
	const [sidenavData, setSidenavData] = useState<ITeachingAssignmentSidenavData[]>([]);
	const [termStudyOptions, setTermStudyOptions] = useState<IDropdownOption<number>[]>([]);
	const [automationResult, setAutomationResult] = useState<IAutoTeacherAssignmentResponse[]>([]);
	const [editingObjects, setEditingObjects] = useState<ITeacherAssignmentRequest[]>([]);

	//Modal status
	const [isFilterable, setIsFilterable] = useState<boolean>(true);
	const [isModifyingResultModalOpen, setModifyingResultModalOpen] = useState<boolean>(false);
	const [isAutoApplyModalOpen, setIsAutoApplyModalOpen] = useState<boolean>(false);

	// Fetch data
	const {
		data: classData,
		isValidating: isClassValidating,
		mutate: updateClass,
	} = useFetchClassData({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
		schoolYearId: selectedSchoolYearId,
	});
	const {
		data: teachingAssignmentData,
		mutate: updateTeachingAssignment,
		isValidating: isTeachingAssignmentValidating,
	} = useFetchTeachingAssignment({
		sessionToken,
		schoolId: Number(schoolId),
		schoolYearId: selectedSchoolYearId,
		studentClassId: selectedClassId,
		termId: selectedTermId,
	});
	const {
		data: teacherData,
		mutate: updateTeacher,
		isValidating: isTeacherValidating,
	} = useFetchTeacher({
		sessionToken,
		schoolId,
		pageSize: 1000,
		pageIndex: 1,
	});
	const {
		data: termData,
		error: termFetchError,
		mutate: updateTerm,
	} = useFetchTerm({
		pageIndex: 1,
		pageSize: 100,
		schoolYearId: selectedSchoolYearId,
	});

	// Process data
	useEffect(() => {
		if (termData?.status === 200) {
			const studyOptions: ISortableDropdown<number>[] = termData.result.items.map(
				(item: ITermResponse) => ({
					value: item.id,
					label: `${item.name} | (${item['school-year-start']}-${item['school-year-end']}) `,
					criteria: item.name,
				})
			);
			setTermStudyOptions(
				studyOptions.sort((a, b) =>
					(a.criteria as string).localeCompare(b.criteria as string)
				)
			);
		}
	}, [termData]);

	useEffect(() => {
		updateTerm({ schoolYearId: selectedSchoolYearId });
		if (termData?.status === 200) {
			const termInYear: ITermResponse[] = termData.result.items.filter(
				(term: ITermResponse) => term['school-year-id'] === selectedSchoolYearId
			);
			if (termInYear.length > 0) {
				const studyOptions: ISortableDropdown<number>[] = termInYear.map(
					(item: ITermResponse) => ({
						value: item.id,
						label: `${item.name} | (${item['school-year-start']}-${item['school-year-end']}) `,
						criteria: item.name,
					})
				);
				setTermStudyOptions(
					studyOptions.sort((a, b) =>
						(a.criteria as string).localeCompare(b.criteria as string)
					)
				);
				if (!studyOptions.some((item) => item.value === selectedTermId))
					setSelectedTermId(studyOptions[0].value);
			} else {
				useNotify({
					type: 'error',
					message: 'Không có học kỳ cho năm học này',
				});
			}
		}
	}, [selectedSchoolYearId]);

	useEffect(() => {
		updateClass();
		if (classData?.status === 200) {
			const tmpData: ITeachingAssignmentSidenavData[] = useSidenavDataConverter(
				classData.result.items as IClassResponse[]
			);
			if (tmpData.length > 0) {
				setSidenavData(tmpData);
				setSelectedClassId(tmpData[0].items[0].value);
				setSelectedCurriculumName(tmpData[0].items[0].extra);
			}
		}
	}, [classData]);

	// Process data after fetching teaching assignment data
	useEffect(() => {
		updateTeachingAssignment();
		updateTeacher();
		setTableData([]);
		if (teachingAssignmentData?.status === 200 && teacherData?.status === 200) {
			const assignedList: ITeachingAssignmentTableData[] = teachingAssignmentData.result[
				'teacher-assignt-view'
			].map((item: ITeachingAssignmentResponse) => {
				const existingAssignment =
					editingObjects.find((assignment) => assignment.id === item.id) ??
					dataStored['teacher-assignments'].find(
						(assignment) => assignment.id === item.id
					);
				if (existingAssignment !== undefined) {
					const existingTeacher: ITeacherResponse = teacherData.result.items.find(
						(teacher: ITeacherResponse) =>
							teacher.id === existingAssignment['teacher-id']
					);
					return {
						id: item.id,
						subjectName: item['subject-name'],
						teacherName: existingAssignment
							? {
									label: `${existingTeacher['first-name']} ${existingTeacher['last-name']} (${existingTeacher.abbreviation})`,
									value: existingAssignment['teacher-id'],
							  }
							: {
									label: '- - -',
									value: 0,
							  },
						totalSlotPerWeek: item['period-count'],
						subjectKey: item['subject-id'],
					} as ITeachingAssignmentTableData;
				}
				return {
					id: item.id,
					subjectName: item['subject-name'],
					teacherName: { label: '- - -', value: 0 },
					totalSlotPerWeek: item['period-count'],
					subjectKey: item['subject-id'],
				} as ITeachingAssignmentTableData;
			});
			const notAssignedList: ITeachingAssignmentTableData[] = teachingAssignmentData.result[
				'teacher-not-assignt-view'
			].map((item: ITeachingAssignmentResponse) => {
				const existingAssignment =
					editingObjects.find((assignment) => assignment.id === item.id) ??
					dataStored['teacher-assignments'].find(
						(assignment) => assignment.id === item.id
					);
				if (existingAssignment !== undefined) {
					const existingTeacher: ITeacherResponse = teacherData.result.items.find(
						(teacher: ITeacherResponse) =>
							teacher.id === existingAssignment['teacher-id']
					);
					return {
						id: item.id,
						subjectName: item['subject-name'],
						teacherName: existingAssignment
							? {
									label: `${existingTeacher['first-name']} ${existingTeacher['last-name']} (${existingTeacher.abbreviation})`,
									value: existingAssignment['teacher-id'],
							  }
							: {
									label: '- - -',
									value: 0,
							  },
						totalSlotPerWeek: item['period-count'],
						subjectKey: item['subject-id'],
					} as ITeachingAssignmentTableData;
				}
				return {
					id: item.id,
					subjectName: item['subject-name'],
					teacherName: { label: '- - -', value: 0 },
					totalSlotPerWeek: item['period-count'],
					subjectKey: item['subject-id'],
				} as ITeachingAssignmentTableData;
			});
			const tableData: ITeachingAssignmentTableData[] = useFilterArray(
				[...notAssignedList, ...assignedList],
				['id']
			).reverse();
			setTableData(tableData);
		}
	}, [teachingAssignmentData, teacherData, selectedSchoolYearId, selectedClassId]);

	// Render skeleton if data while fetching data
	if (isClassValidating || isTeachingAssignmentValidating || isTeacherValidating) {
		return (
			<div className='w-full h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
				<div className='w-full h-full flex flex-row justify-start items-start'>
					{isClassValidating ? (
						<TeachingAssignmentSideNavSkeleton />
					) : (
						<TeachingAssignmentSideNav
							selectedClass={selectedClassId}
							setSelectedClass={setSelectedClassId}
							setSelectedCurriculumName={setSelectedCurriculumName}
							classData={sidenavData}
						/>
					)}
					<div className='w-[85%] h-full flex justify-center items-start gap-5 overflow-y-scroll no-scrollbar'>
						<TeachingAssignmentTableSkeleton />
						{termStudyOptions.length > 0 ? (
							<TeachingAssignmentFilterable
								open={isFilterable}
								setOpen={setIsFilterable}
								selectedTermId={selectedTermId}
								setSelectedTermId={setSelectedTermId}
								termStudyOptions={termStudyOptions}
								isApplyModalOpen={isAutoApplyModalOpen}
								setIsApplyModalOpen={setIsAutoApplyModalOpen}
							/>
						) : (
							<TeachingAssignmentFilterableSkeleton />
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='w-full h-screen flex flex-col justify-start items-start overflow-y-scroll no-scrollbar'>
			<div className='w-full h-full flex flex-row justify-start items-start overflow-y-hidden'>
				<TeachingAssignmentSideNav
					selectedClass={selectedClassId}
					setSelectedClass={setSelectedClassId}
					setSelectedCurriculumName={setSelectedCurriculumName}
					classData={sidenavData}
				/>
				<div className='w-[85%] h-full flex justify-center items-start gap-5'>
					<TeachingAssignmentTable
						subjectData={tableData}
						mutate={updateTeachingAssignment}
						isFilterable={isFilterable}
						setIsFilterable={setIsFilterable}
						selectedCurriculumName={selectedCurriculumName}
						editingObjects={editingObjects}
						setEditingObjects={setEditingObjects}
					/>
					<TeachingAssignmentFilterable
						open={isFilterable}
						setOpen={setIsFilterable}
						selectedTermId={selectedTermId}
						setSelectedTermId={setSelectedTermId}
						termStudyOptions={termStudyOptions}
						isApplyModalOpen={isAutoApplyModalOpen}
						setIsApplyModalOpen={setIsAutoApplyModalOpen}
					/>
					<TeachingAssignmentAutoApplyModal
						open={isAutoApplyModalOpen}
						setOpen={setIsAutoApplyModalOpen}
						setAutomationResult={setAutomationResult}
						setModifyingResultModalOpen={setModifyingResultModalOpen}
						assignedTeachers={editingObjects}
						dataStored={dataStored}
					/>
					<TeachingAssignmentAdjustModal
						open={isModifyingResultModalOpen}
						setOpen={setModifyingResultModalOpen}
						automationResult={automationResult}
						sidenavData={sidenavData}
						updateTeachingAssignment={updateTeachingAssignment}
					/>
				</div>
			</div>
		</div>
	);
}
