export const REQUEST_TYPE: { key: string; value: number}[] = [
  { key: "Other", value: 1},
  { key: "RequestAbsenntSchedule", value: 2 },
  { key: "RequestChangeSlot", value: 3},
];

export const REQUEST_TYPE_TRANSLATOR: { [key: number]: string} = {
  1: "Khác",
  2: "Đơn xin nghỉ",
  3: "Đơn xin thay đổi lịch dạy"
}

export interface ISendApplication {
  "teacher-id": number;
  "school-year-id": number;
  "request-type": string;
  "request-description": string;
  "attached-file": string;
}
