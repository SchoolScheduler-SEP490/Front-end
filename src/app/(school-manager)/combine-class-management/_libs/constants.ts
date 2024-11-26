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
}

export interface ITerm {
    
}