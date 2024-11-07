import { IAddTeacherData, IUpdateTeacherRequestBody  } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";
  
  export const deleteTeacherById = async (
    api: string,
    id: number,
    schoolId: string,
    sessionToken: string
  ): Promise<void> => {
    if (!sessionToken) {
      throw new Error('Session token not found. Please log in.');
    }

    const url = `${api}/api/schools/${schoolId}/teachers/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  export const addTeacher = async (
    api: string,
    schoolId: string,
    sessionToken: string,
    teacherData: IAddTeacherData
  ): Promise<any> => {
    if (!sessionToken) {
      console.error('Session token is not found. Please log in.');
      return false;
    }
  
    const url = `${api}/api/schools/${schoolId}/teachers`;
    const requestBody = [teacherData];
    console.log('Request Body:', requestBody);
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data;
  };  

  export const updateTeacher = async (
    api: string,
    id: number,
    sessionToken: string,
    schoolId: string,
    teacherData: IUpdateTeacherRequestBody,
  ): Promise<boolean> => {
    if (!sessionToken) {
      console.error('Session token is not found. Please log in.');
      return false;
    }
  
    const url = `${api}/api/schools/${schoolId}/teachers/${id}`;
    const requestBody = teacherData;
    console.log('Request Body:', requestBody);
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
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
  }  

export const getDepartmentName = async (
  schoolId: string,
  sessionToken: string
) => {
  const initialResponse = await fetch(
    `${api}/api/schools/${schoolId}/departments?pageIndex=1&pageSize=20`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
    }
  );
  const initialData = await initialResponse.json();
  const totalCount = initialData.result["total-item-count"];
  const response = await fetch(
    `${api}/api/schools/${schoolId}/departments?pageIndex=1&pageSize=${totalCount}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
    }
  );
  const data = await response.json();
  return data;
}

export const getSubjectName = async (
  sessionToken: string,
  schoolYearId: number
) => {
  const initialResponse = await fetch(
    `${api}/api/subjects?schoolYearIdint=${schoolYearId}&includeDeleted=false&pageIndex=1&pageSize=20`,
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
    `${api}/api/subjects?schoolYearIdint=${schoolYearId}&includeDeleted=false&pageIndex=1&pageSize=${totalCount}`,
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

