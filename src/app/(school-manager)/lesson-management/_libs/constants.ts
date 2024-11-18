// Curriculum Fetcher Props
export interface IFetchCurriculumBodyProps {
	sessionToken: string;
	pageSize: number;
	pageIndex: number;
	schoolId: string;
	schoolYearId: number;
	subjectGroupId?: number;
	grade?: number;
	deletedIncluded?: boolean;
}

//Curriculum Data response
export interface ICurriculumObjectResponse {
	id: number;
	'curriculum-name': string;
	grade: string;
}

export interface ICurriculumSidenavData {
	title: string;
	items: { key: string; value: number }[];
}

export interface ISchoolYearResponse {
	id: number;
	'start-year': string;
	'end-year': string;
	'school-year-code': string;
}

export interface ILessonTableData {
	id: number;
	lessonName: string;
	mainTotalSlotPerWeek: number;
	mainMinimumCouple: number;
	subTotalSlotPerWeek: number;
	subMinimumCouple: number;
	isDouleSlot: boolean;
	isRequiredSubject: boolean;
	isSpecializedSubject: boolean;
	slotPerTerm: number;
}

export interface ICurriculumDetailResponse {
	id: number;
	'group-code': string;
	'group-name': string;
	'school-id': number;
	'group-description': string;
	grade: string;
	'subject-selective-views': ISubjectInGroup[];
	'subject-specializedt-views': ISubjectInGroup[];
	'subject-required-views': ISubjectInGroup[];
	'student-class-views': any[];
	'subject-group-type-name': string | null;
	'school-year-id': number;
	'school-year': string;
}

export interface ISubjectInGroup {
	id: number;
	'subject-name': string;
	abbreviation: string;
	'subject-in-group-type': number;
	'is-required': boolean;
	description: string;
	'main-slot-per-week': number;
	'sub-slot-per-week': number;
	'total-slot-per-week': number;
	'is-specialized': boolean;
	'is-double-period': boolean;
	'slot-per-term': number;
	'term-id': number;
	'total-slot-in-year': number;
	'slot-specialized': number;
	'subject-group-type': string;
	'main-minimum-couple': number;
	'sub-minimum-couple': number;
}

export interface IUpdateSubjectInGroupRequest {
	'curriculum-detail-id': number;
	'main-slot-per-week': number;
	'sub-slot-per-week': number;
	'slot-per-term': number;
	'is-double-period': boolean;
	'main-minimum-couple': number;
	'sub-minimum-couple': number;
}

export interface IQuickAssignResponse {
	'subject-id': number;
	'subject-name': string;
	'subject-abbreviation': string;
	'main-slot-per-week': number;
	'sub-slot-per-week': number;
	'slot-per-term': number;
	'is-double-period': boolean;
	'main-minimum-couple': number;
	'sub-minimum-couple': number;
	'term-id': number;
	'term-name': string;
}

export interface IQuickAssignRequest {
	'subject-id': number;
	'subject-name': string;
	'subject-abbreviation': string;
	'main-slot-per-week': number;
	'sub-slot-per-week': number;
	'slot-per-term': number;
	'is-double-period': boolean;
	'main-minimum-couple': number;
	'sub-minimum-couple': number;
	'term-id': number;
	'term-name': string;
}

export interface IQuickAssignRequestBody {
	'subject-assignment-configs': IQuickAssignRequest[];
	'curriculum-apply-ids': number[];
}

export interface TermSeperatedAssignedObject {
	[key: string]: IQuickAssignResponse[];
}
