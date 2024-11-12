export interface IClassTableData {
  id: number;
  className: string;
  grade: number;
  homeroomTeacherName: string;
  schoolYear: string;
  mainSession: string;
  subjectGroup: string;
}
export interface IClass {
  id: number;
  name: string;
  grade: number;
  "homeroom-teacher-name": string;
  "school-year-code"?: string;
  "main-session-text": string;
  "subject-group-name": string;
}
export interface ISchoolYear {
  id: number;
  "start-year": string;
  "end-year": string;
  "school-year-code": string;
}

export interface IAddClassData {
  name: string;
  "homeroom-teacher-abbreviation"?: string;
  "main-session": number;
  "is-full-day": boolean;
  grade: string;
  "subject-group-code": string;
}
export interface ITeacher {
  id: number;
  "first-name": string;
  "last-name": string;
  abbreviation: string;
}

export interface IUpdateClassData {
  name: string;
  "homeroom-teacher-id": number;
  "school-id": number;
  "school-year-id": number;
  "main-session": string;
  "is-full-day": boolean;
  "period-count": number;
  grade: number;
  "subject-group-id": number;
}

export interface IDropdownOption<T> {
  value: T;
  label: string;
}

export interface ISubjectGroup {
  id: number;
  "group-code": string;
  "group-name": string;
}

export interface IClassDetail {
  id: number;
  name: string;
  "homeroom-teacher-id": number;
  "homeroom-teacher-name": string;
  "homeroom-teacher-abbreviation": string;
  "main-session": number;
  "main-session-text": string;
  grade: string;
  "is-full-day": boolean;
  "period-count": number;
  "subject-group-id": number;
  "subject-group-name": string;
  "school-year-id": number;
  "create-date": string;
  "update-date": string;
  "is-deleted": boolean;
  "school-year": ISchoolYear; 
}

export interface ISchoolYear {
  id: number;
  "start-year": string;
  "end-year": string;
  "school-year-code": string;
}

export interface ITeacherAssignment {
  "term-id": number,
  "term-name": string,
  "teacher-id": number,
  "teacher-first-name": string,
  "teacher-last-name": string,
  "total-period": number,
  "start-week": number,
  "end-week": number
}

export interface ISubjectAssignment {
  "subject-id": number;
  "subject-name": string;
  "assignment-details": ITeacherAssignment[];
  "total-slot-in-year": number;
}