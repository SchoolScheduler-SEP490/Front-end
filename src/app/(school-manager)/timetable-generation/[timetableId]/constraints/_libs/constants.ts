import { IDropdownOption } from '@/app/(school-manager)/_utils/contants';

export interface IConstraintsSidenavData {
	category: string;
	items: IDropdownOption<string>[];
}

export const TIMETABLE_SLOTS = [
	{ period: 'Sáng', slots: ['Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5'] },
	{ period: 'Chiều', slots: ['Tiết 6', 'Tiết 7', 'Tiết 8', 'Tiết 9', 'Tiết 10'] },
];

export const WEEK_DAYS = ['T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
