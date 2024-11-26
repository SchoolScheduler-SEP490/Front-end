import { IDropdownOption } from '../../_utils/contants';

export interface IClassGroupResponse {
	id: number;
	'group-name': string;
	'school-id': number;
	'curriculum-id': number;
	'group-description': string;
	'student-class-group-code': string;
	grade: number;
	'school-year-id': number;
	classes: {
		id: number;
		name: string;
	}[];
	'create-date': string;
	'update-date': string;
	'is-deleted': boolean;
}

export const TIMETABLE_GENERATION_TABS: IDropdownOption<string>[] = [
	{ label: 'Thông tin chung', value: 'information' },
	{ label: 'Cấu hình ràng buộc', value: 'constraints' },
	{ label: 'Phân công giáo viên', value: 'teaching-assignment' },
	{ label: 'Xếp tiết cố định', value: 'teachers-lessons' },
	{ label: 'Tạo thời khóa biểu', value: 'timetable-generation' },
];
