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

// Update teacher response data
export interface IUpdateTeacherRequestBody {
  "first-name": string;
  "last-name": string;
  abbreviation: string;
  email: string;
  gender: string;
  "department-id": string;
  "date-of-birth": string;
  "school-id": string;
  "teacher-role": string;
  status: string;
  phone: string;
  "is-deleted": boolean;
}
export interface IUpdateTeachableSubject {
  "subject-abreviation": string;
  grades: string[];
  "is-main": boolean;
}
//Create new teacher request data
export interface IAddTeacherData {
  "first-name": string;
  "last-name": string;
  abbreviation: string;
  email: string;
  gender: string;
  "department-code": string;
  "date-of-birth": string;
  "teacher-role": string;
  status: string;
  phone: string;
}

export interface IMainSubject {
  "subject-abreviation": string;
  "list-approriate-level-by-grades": IAppropriateLevel[];
  "is-main": boolean;
}

export interface IAppropriateLevel {
  id: number,
  "is-main": boolean,
  "appropriate-level": number;
  grade: string;
}
export interface IDepartment {
  id: number;
  name: string;
  "department-code": string;
}

export interface ISubject {
  id: number;
  "subject-name": string;
  abbreviation: string;
  "is-teached-by-homeroom-teacher": boolean;
}

// use to get teachable subjects
export interface ITeachableSubject {
  "subject-id": number;
  "subject-name": string;
  abbreviation: string;
  "list-approriate-level-by-grades": IAppropriateLevel[];
  "is-main": boolean;
}

export interface ITeacherDetail {
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
  "is-have-account": boolean;
  phone: string;
  "teachable-subjects": ITeachableSubject[];
}
export interface ITeacherAssignment {
  "teacher-id": number;
  "teacher-first-name": string;
  "teacher-last-name": string;
  "total-slot-in-year": number;
  "assignment-details": IAssignmentDetail[];
}

export interface IAssignmentDetail {
  "subject-id": number;
  "subject-name": string;
  "class-name": string;
  "start-week": number;
  "end-week": number;
  "total-period": number;
}

// use for update teachable subject (api patch)
export interface ITeachableSubjectRequest {
  "subject-abreviation": string;
  "list-approriate-level-by-grades": Array<{
    id: number;
    "is-main": boolean;
    "appropriate-level": string;
    grade: string;
  }>;
}

export interface ITeachableSubjectResponse {
  id: number;
  "first-name": string;
  "last-name": string;
  abbreviation: string;
  email: string;
  gender: string;
  "department-id": number;
  "department-name": string;
  "date-of-birth": string;
  "teacher-role": number;
  status: number;
  "is-deleted": boolean;
  phone: string;
  "period-count": number;
  "teachable-subjects": ITeachableSubject[];
}

export interface ITeacherAccountResponse {
  id: number;
  "first-name": string;
  "last-name": string;
  abbreviation: string;
  email: string;
  gender: string;
  "department-id": number;
  "department-name": string;
  "teacher-role": string;
  "is-teacher-head-department": boolean;
  "teacher-status": string;
  "is-deleted": boolean;
  "is-have-account": boolean;
  "account-status": string | null;
  "account-id": number | null;
}

export interface IGenerateAccountRequest {
  "school-id": number,
  "teacher-id": number
}

export interface IUpdateAccountRequest {
	'account-id': number;
	'account-status': string;
}