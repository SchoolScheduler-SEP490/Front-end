import { IAddClassData, IUpdateClassData } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";

//get school year code to display on table
export const fetchSchoolYear = async (sessionToken: string) => {
  const response = await fetch(`${api}/api/academic-years`, {
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
    `${api}/api/schools/${schoolId}/teachers?includeDeleted=false&pageSize=20&pageIndex=1`,
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
    `${api}/api/schools/${schoolId}/teachers?includeDeleted=false&pageSize=${totalCount}&pageIndex=1`,
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
  classData: IAddClassData,
  schoolYearId: number
): Promise<any> => {
  if (!sessionToken) {
    console.error("Session token is not found. Please log in.");
    return false;
  }
  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes`;
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
  sessionToken: string,
  schoolId: string,
  schoolYearId: number
): Promise<void> => {
  if (!sessionToken) {
    throw new Error("Session token not found. Please log in.");
  }
  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes/${id}`;

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
  classData: IUpdateClassData,
  schoolId: string,
  schoolYearId: number
): Promise<boolean> => {
  if (!sessionToken) {
    console.error("Session token is not found. Please log in.");
    return false;
  }

  const url = `${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes/${id}`;
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


export const getSubjectGroup = async (
  sessionToken: string,
  schoolId: string,
  selectedSchoolYearId: number
) => {
    const initialResponse = await fetch(
      `${api}/api/schools/${schoolId}/academic-years/${selectedSchoolYearId}/subject-groups?includeDeleted=false&pageIndex=1&pageSize=20`,
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
      `${api}/api/schools/${schoolId}/academic-years/${selectedSchoolYearId}/subject-groups?includeDeleted=false&pageIndex=1&pageSize=${totalCount}`,
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

export const getTeacherAssignment = async (
  id: number,
  sessionToken: string,
  schoolId: string,
  schoolYearId: number
) => {
  const response = await fetch (`${api}/api/schools/${schoolId}/academic-years/${schoolYearId}/classes/${id}/assignments-in-class`, 
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
    }
  )
  const data = await response.json();
  return data;
}