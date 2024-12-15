import { IScheduleResponse } from "@/utils/constants";
import { IUpdateTimetableStatus, IWeekDataResponse } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL;

export const updateTimetableStatus = async (
  schoolId: string,
  yearId: number,
  statusData: IUpdateTimetableStatus,
  sessionToken: string
): Promise<boolean> => {

  const url = `${api}/api/schools/${schoolId}/academic-years/${yearId}/timetables/status`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(statusData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating timetable status:", error);
    return false;
  }
};

export const publishTimetable = async (
  schoolId: string,
  yearId: number,
  scheduleData: IScheduleResponse,
  sessionToken: string
): Promise<boolean> => {
  const url = `${api}/api/schools/${schoolId}/academic-years/${yearId}/timetables/publish`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(scheduleData),
    });

    const data = await response.json();
    console.log("Publish Response:", data);
    return data;
  } catch (error) {
    console.error("Error publishing timetable:", error);
    throw error;
  }
};

// Update the getWeekDate function to handle errors better
export const getWeekDate = async (
  schoolId: string,
  yearId: number,
  termId: number,
  sessionToken: string
): Promise<IWeekDataResponse> => {
  const url = `${api}/api/schools/${schoolId}/academic-years/${yearId}/timetables/get-week-dates?termId=${termId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      result: Array.isArray(data.result) ? data.result : []
    };
  } catch (error) {
    console.error("Error fetching week dates:", error);
    return { result: [] };
  }
};


export const getTerms = async (
  sessionToken: string,
  selectedSchoolYearId: number
) => {
  const initialResponse = await fetch(
    `${api}/api/academic-years/${selectedSchoolYearId}/terms?pageIndex=1&pageSize=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );

  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];

  const response = await fetch(
    `${api}/api/academic-years/${selectedSchoolYearId}/terms?pageIndex=1&pageSize=${totalCount}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
}; 