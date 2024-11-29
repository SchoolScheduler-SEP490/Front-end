import { ROOM_SUBJECT_MODEL } from "@/utils/constants";

export interface ICombineClassData {
  id: number;
  subjectId: number;
  roomId: number;
  roomSubjectCode: string;
  studentClass: number;
  termId: number;
}

export interface IClassCombine {
  id: number;
  "subject-id": number;
  "room-id": number;
  "room-subject-code": string;
  "student-class": number;
  "term-id": number;
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
  "model": typeof ROOM_SUBJECT_MODEL[number]['key'];
  "student-class-id": number[];
}
