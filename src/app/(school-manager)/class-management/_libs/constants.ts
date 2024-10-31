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

export interface IAddClassData {
  name: string;
  "homeroom-teacher-abbreviation"?: string;
  "main-session": number;
  "is-full-day": boolean;
  "period-count": number;
  grade: string;
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
