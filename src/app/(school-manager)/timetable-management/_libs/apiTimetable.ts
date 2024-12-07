import { IScheduleResponse } from "@/utils/constants";

const api = process.env.NEXT_PUBLIC_API_URL;

export const updateTimetableStatus = async (
  schoolId: string,
  yearId: number,
  termId: number,
  scheduleStatus: string,
  sessionToken: string
): Promise<boolean> => {
  const url = `${api}/api/schools/${schoolId}/academic-years/${yearId}/timetables/status?termId=${termId}&scheduleStatus=${scheduleStatus}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(scheduleData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error publishing timetable:', error);
    return false;
  }
};