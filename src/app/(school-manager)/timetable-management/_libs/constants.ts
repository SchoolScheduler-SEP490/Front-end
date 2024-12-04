export interface ITimetableTableData {
    id: string;
    timetableCode: string;
    timetableName: string;
    appliedWeek: string | null;
    endedWeek: string | null;
    status: number;
    termId: number;
    termName: string;
    yearName: string;
}

export interface IClassPeriod {
    Id: number;
    RoomCode: string;
    SubjectAbbreviation: string;
    TeacherAbbreviation: string;
    DateOfWeek: number;
    StartAt: number;
    Priority: string;
}

export interface IClassSchedule {
    Id: number;
    ClassPeriods: IClassPeriod[];
}

export interface ISchoolScheduleDetails {
    Id: number;
    Name: string;
    TermName: string;
    ApplyDate: string;
    ExpiredDate: string;
    FitnessPoint: number;
    ClassSchedules: IClassSchedule[];
}

export interface IClass {
    id: number;
    name: string;
    grade: string;
}

export const WEEKDAYS = [
    { id: 1, name: 'Thứ 2' },
    { id: 2, name: 'Thứ 3' },
    { id: 3, name: 'Thứ 4' },
    { id: 4, name: 'Thứ 5' },
    { id: 5, name: 'Thứ 6' },
    { id: 6, name: 'Thứ 7' },
    { id: 0, name: 'Chủ nhật' }
];

export const SAMPLE_CLASSES = [
    { id: 1, name: '10A1', grade: '10' },
    { id: 2, name: '10A2', grade: '10' },
    { id: 3, name: '11A1', grade: '11' },
    { id: 4, name: '11A2', grade: '11' },
    { id: 5, name: '12A1', grade: '12' },
    { id: 6, name: '12A2', grade: '12' },
    { id: 7, name: '12A3', grade: '12' },
    { id: 8, name: '12A4', grade: '12' },
    { id: 9, name: '12A5', grade: '12' },
    { id: 10, name: '12A6', grade: '12' },
];

export const TIME_SLOTS = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
}));
