export interface IProvince {
  id: number;
  name: string;
}

export interface IDistrict {
  "province-id": number;
  name: string;
  "district-code": number;
}

export interface ISchool {
  id: number;
  name: string;
  address: string;
  "province-id": number;
  "province-name": string;
  "district-code": number;
}
