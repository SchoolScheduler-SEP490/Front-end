export interface IClassTableData {
    id: number;
    className: string;
    grade: number;
    homeroomTeacherName: string;
    schoolYear: string;
    mainSession: string;
}
export interface IClass {
    id: number;
    name: string;
    grade: number;
    "homeroom-teacher-name": string;
    "school-year-code"?: string;
    "main-session-text": string;
}
export interface ISchoolYear {
    id: number;
    "start-year": string;
    "end-year": string;
    "school-year-code": string;
}