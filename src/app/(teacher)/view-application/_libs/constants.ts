
export interface IViewApplication {
    'teacher-id': number;
    'teacher-first-name': string;
    'teacher-last-name': string;
    'request-type': string;
    'request-time': string;
    status: string;
    'request-description': string;
    'process-note': string | null;
    'attached-file': string | null;
    'school-year-id': number;
    'school-year-code': string;
    id: number;
    'create-date': string;
    'update-date': string | null;
    'is-deleted': boolean;
}