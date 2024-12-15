import { INavigation } from '@/utils/constants';

export interface IAdminSidenav {
    category: string;
    items: ITeacherHeadNavigation[];
}

export interface ITeacherHeadNavigation extends INavigation {
    icon: string;
}

export const TEACHER_HEAD_SIDENAV: ITeacherHeadNavigation[] = [
    {
        name: 'Thời khóa biểu giáo viên',
        url: '/teacher-head-dashboard',
        icon: '/images/icons/schedule.png',
    },
    {
        name: 'Danh sách giáo viên',
        url: '/list-of-teachers',
        icon: '/images/icons/teacher-timetable.png',
    },

];
