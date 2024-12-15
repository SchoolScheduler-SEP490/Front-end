export interface ITimetableTableData {
  id: string;
  timetableCode: string;
  timetableName: string;
  appliedWeek: string | null;
  endedWeek: string | null;
  status: number;
  termId: number;
  termName: string;
  yearName: string;
  generatedScheduleId: string;
  generatedDate: string;
  "applied-week": number;
  "ended-week": number;
  "term-id": number;
  "term-name": string;
}


export interface IUpdateTimetableStatus {
  "term-id": number;
  "start-week": number;
  "end-week": number;
  "schedule-status": string;
}

export interface IWeekDate {
  "week-number": number;
  "start-date": string;
  "end-date": string;
}

export interface IWeekDataResponse {
  result: IWeekDate[];
}

export interface ITerm {
  id: number;
  name: string;
}