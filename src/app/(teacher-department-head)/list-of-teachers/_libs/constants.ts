// Display data table teacher
export interface ITeacherTableData {
  id: number;
  teacherName: string;
  nameAbbreviation: string;
  subjectDepartment: string;
  email: string;
  phoneNumber: string;
  status: number;
  teachableSubjects: string;
}
//Teacher response data
export interface ITeacher {
  id: number;
  "first-name": string;
  "last-name": string;
  abbreviation: string;
  email: string;
  gender: string;
  "department-id": number;
  "department-name": string;
  "date-of-birth": string;
  "teacher-role": string;
  status: number;
  "is-deleted": boolean;
  phone: string;
  "teachable-subjects": ITeachableSubject[];
}

export interface ITeachableSubject {
  "subject-id": number;
  "subject-name": string;
  abbreviation: string;
  "is-main": boolean;
}

export interface IDepartment {
    id: number;
    name: string;
    "department-code": string;
  }