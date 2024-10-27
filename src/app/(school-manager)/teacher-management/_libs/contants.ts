// Display data table teacher
export interface ITeacherTableData {
	id: number;
	teacherName: string;
	nameAbbreviation: string;
	subjectDepartment: string;
	email: string;
	phoneNumber: string;
	status: string;
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
}

// Update teacher response data
export interface IUpdateTeacherRequestBody {
  "first-name": string;
  "last-name": string;
  abbreviation: string;
  email: string;
  gender: string;
  "department-id": number;
  "date-of-birth": string;
  "school-id": number;
  "teacher-role": string;
  status: string;
  phone: string;
  "is-deleted": boolean;
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