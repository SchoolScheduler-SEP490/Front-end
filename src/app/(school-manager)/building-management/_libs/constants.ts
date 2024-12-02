export interface IBuildingTableData {
  id: number;
  name: string;
  buildingCode: string;
  description: string;
  floor: number;
}

export interface IBuilding {
  id: number;
  name: string;
  "building-code": string;
  description: string;
  floor: number;
}

export interface IAddBuilding {
  name: string;
  description: string;
  "building-code": string;
  floor: number;
}

export interface IUpdateBuilding {
  name: string;
  description: string;
  "building-code": string;
  floor: number;
}

export interface IBuildingDetail {
  id: number;
  name: string;
  description: string;
  "building-code": string;
  floor: number;
  rooms: IRoom[];
}

export interface IRoom {
  id: number;
  name: string;
  "room-code": string;

}

export interface IExistingBuilding {
  id: number;
  name: string;
  "building-code": string;
}

export interface IBuildingResponse {
  status: number;
  message: string;
  result: {
    items: IExistingBuilding[];
    "total-item-count": number;
  };
}