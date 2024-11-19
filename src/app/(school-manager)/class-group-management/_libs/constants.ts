export interface IClassGroupTableData {
  id: number;
  groupName: string;
  studentClassGroupCode: string;
  grade: number;
  curriculum: number;
  createDate: string;
  classes: IClass[];
}

export interface IClassGroup {
  id: number;
  "group-name": string;
  "student-class-group-code": string;
  grade: number;
  "curriculum-id": number;
  "create-date": string;
  classes: IClass[];
}

export interface IClass {
  id: number;
  name: string;
}

export interface IAddClassGroup {
  "group-name": string;
  "group-description": string;
  "student-class-group-code": string;
  grade: string;
}

export interface IAssignClass {
  "class-ids": number[];
}

export interface IStudentClass {
  id: number;
  name: string;
}

export interface ICurriculum {
  id: number;
  "curriculum-name": string;
}
