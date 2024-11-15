import { IDropdownOption } from '../../_utils/contants';

export const TIMETABLE_GENERATION_TABS: IDropdownOption<string>[] = [
	{ label: 'Phân công giáo viên', value: 'teaching-assignment' },
	{ label: 'Tạo ràng buộc', value: 'constraints' },
	{ label: 'Sắp Thời khóa biểu', value: 'timetable-configuration' },
	{ label: 'Xem/Sửa Thời khóa biểu', value: 'timetable-adjustment' },
	{ label: 'Xuất/Công bố Thời khóa biểu', value: 'timetable-export' },
];
