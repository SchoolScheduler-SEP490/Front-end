import { ROOM_SUBJECT_MODEL } from "@/utils/constants";

export interface ICombineClassData {
  id: number;
  subjectId: number;
  roomId: number;
  roomSubjectCode: string;
  studentClass: number;
  termId: number;
  teacherAbbreviation: string;
}

export interface IClassCombine {
  id: number;
  "subject-id": number;
  "room-id": number;
  "room-subject-code": string;
  "student-class": number;
  "term-id": number;
  "teacher-abbreviation": string;
}

export interface ISubject {
  id: number;
  "subject-name": string;
}

export interface IRoom {
  id: number;
  name: string;
  "max-class-per-time": number;
}

export interface ITerm {
  id: number;
  name: string;
}

// to get class can combine
export interface IClassCombination {
  id: number;
  name: string;
}
export interface IClassCombinationFilter {
  session: "Morning" | "Afternoon";
  grade: string;
  subjectId: number;
  termId: number;
}
export interface IAddCombineClassRequest {
  "subject-id": number;
  "room-id": number;
  "school-id": string;
  "term-id": number;
  "room-subject-code": string;
  "room-subject-name": string;
  grade: string;
  "model": typeof ROOM_SUBJECT_MODEL[number]['key'];
  "teacher-id": number;
  session: string;
  "student-class-id": number[];
}

export interface IExistingCombineClass {
  id: number;
  "room-subject-name": string;
  "room-subject-code": string;
}

export interface IExistingCombineClassResponse {
  status: number;
  message: string;
  result: {
    items: IExistingCombineClass[];
    "total-item-count": number;
  };
}

export interface ITeachableSubject {
  id: number;
  "teacher-id": number;
  "teacher-name": string;
  "teacher-abreviation": string;
  "subject-id": number;
  "subject-name": string;
  "subject-abreviation": string;
}

export interface IUpdateCombineClass {
  "subject-id": number;
  "room-id": number;
  "term-id": number;
  "teacher-id": number;
  "room-subject-code": string;
  "room-subject-name": string;
  grade: string;
  model: typeof ROOM_SUBJECT_MODEL[number]['key'];
  session: string;
  "student-class-ids": number[];
}
export interface IStudentClass {
  id: number;
  "student-class-name": string;
}

export interface ICombineClassDetail {
  id: number;
  "subject-id": number;
  "room-id": number;
  "term-id": number;
  "room-subject-code": string;
  "room-subject-name": string;
  "teacher-id": number;
  "teacher-abbreviation": string;
  "student-class": IStudentClass[];
  "e-grade": string;
  session: string;
  model: typeof ROOM_SUBJECT_MODEL[number]['key'];
  grade: string;
}