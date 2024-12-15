import { INavigation } from '@/utils/constants';

export interface IAdminSidenav {
	category: string;
	items: ITeacherNavigation[];
}

export interface ITeacherNavigation extends INavigation {
	icon: string;
}

export const TEACHER_SIDENAV: ITeacherNavigation[] = [
	{
		name: 'Lịch dạy học dự kiến',
		url: '/teacher-dashboard',
		icon: '/images/icons/schedule.png',
	},
	{
		name: 'Thời khóa biểu chính thức',
		url: '/timetable',
		icon: '/images/icons/teacher-calendar.png',
	},
	{
		name: 'Gửi biểu mẫu',
		url: '/application-form',
		icon: '/images/icons/forms.png',
	},
	{
		name: 'Xem đơn',
		url: '/view-application',
		icon: '/images/icons/view-application.png',
	}
];

export const REQUEST_TYPE: { key: string; value: number}[] = [
	{ key: "Other", value: 1},
	{ key: "RequestAbsenntSchedule", value: 2 },
	{ key: "RequestChangeSlot", value: 3},
  ];
  
  export const REQUEST_TYPE_TRANSLATOR: { [key: number]: string} = {
	1: "Các loại đơn khác",
	2: "Đơn xin nghỉ",
	3: "Đơn xin thay đổi lịch dạy"
  }

  export const APPLICATION_STATUS: {key: string; value: number}[] = [
    {key: "Approved", value: 1},
    {key: "Rejected", value: 2},
    {key: "Pending", value: 3}
]

export const APPLICATION_STATUS_TRANSLATOR: {[key: number]: string} = {
    1: "Đã duyệt",
    2: "Từ chối",
    3: "Đang chờ"
}
