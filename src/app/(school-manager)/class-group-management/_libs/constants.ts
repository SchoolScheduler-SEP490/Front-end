export interface IClassGroupTableData {
  id: number;
  groupName: string;
  studentClassGroupCode: string;
  grade: number;
  curriculum: string | number;
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

export interface IClassGroupDetail {
  id: number,
  "group-name": string;
  "curriculum-id": number;
  "group-description": string;
  "student-class-group-code": string;
  grade: number;
  "create-date": string;
  classes: IClass[];
}

export interface IUpdateClassGroup {
  "group-name": string;
  "group-description": string;
  "student-class-group-code": string;
  grade: number;
}

export interface IExistingClassGroup {
  id: number;
  "group-name": string;
  "student-class-group-code": string;
}

export interface IClassGroupResponse {
  status: number;
  message: string;
  result: {
    items: IExistingClassGroup[];
    "total-item-count": number;
  };
}