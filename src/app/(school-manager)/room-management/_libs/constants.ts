import { ERoomType } from "@/utils/constants";

export interface IRoomTableData {
	id: number;
	roomName: string;
	buildingName: string;
	availableSubjects: string;
	roomType: string;
	status: string;
}

export interface IRoom {
	id: number;
	name: string;
	"building-id": number;
	"room-type": ERoomType;
	"availabilitye-status": string;
  }
  
  export interface IBuilding {
	name: string;
	description: string;
	floor: number;
	"building-code": string;
  }