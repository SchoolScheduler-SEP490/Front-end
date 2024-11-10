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
  "teachable-subjects": ISubject[];
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
  "school-id": number;
  "teacher-role": string;
  status: string;
  phone: string;
  "is-deleted": boolean;
  "teachable-subject-ids": number[];
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
'subjects-abreviation': string[];
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
}

export interface ITeachableSubject {
  "subject-id": number;
  "subject-name": string;
  abbreviation: string;
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
  phone: string;
  "teachable-subjects": ITeachableSubject[];
}