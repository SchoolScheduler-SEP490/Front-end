import { IAddClassData, IUpdateClassData } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

//get school year code to display on table
export const fetchSchoolYear = async (sessionToken: string) => {
  const response = await fetch(`${api}/api/school-years`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getTeacherName = async (
  sessionToken: string,
  schoolId: string
) => {
  const initialResponse = await fetch(
    `${api}/api/teachers?schoolId=${schoolId}&includeDeleted=false&pageSize=1&pageIndex=1`,
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

  //dynamic fetching total count of teacher
  const response = await fetch(
    `${api}/api/teachers?schoolId=${schoolId}&includeDeleted=false&pageSize=${totalCount}&pageIndex=1`,
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

export const addClass = async (
  schoolId: string,
  sessionToken: string,
  classData: IAddClassData
): Promise<any> => {
  if (!sessionToken) {
    console.error("Session token is not found. Please log in.");
    return false;
  }
  const url = `${api}/api/student-classes?schoolId=${schoolId}&schoolYearId=1`;
  const requestBody = [classData];
  console.log("Request Body:", requestBody);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteClassById = async (
  id: number,
  sessionToken: string
): Promise<void> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }
  const url = `${api}/api/student-classes/${id}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

export const updateClass = async (
  id: number,
  sessionToken: string,
  classData: IUpdateClassData
): Promise<boolean> => {
  if (!sessionToken) {
    console.error("Session token is not found. Please log in.");
    return false;
  }
  const url = `${api}/api/student-classes/${id}`;
  const requestBody = classData;
  console.log("Request Body:", requestBody);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error occurred while sending request:", error);
    return false;
  }
};
