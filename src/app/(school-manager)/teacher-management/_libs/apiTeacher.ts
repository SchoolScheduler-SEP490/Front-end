import { IAddTeacherData, ITeacherTableData,IUpdateTeacherRequestBody  } from "./constants";
  
  export const deleteTeacherById = async (
    api: string,
    id: number,
    sessionToken: string
  ): Promise<void> => {
    if (!sessionToken) {
      throw new Error('Session token not found. Please log in.');
    }

    const url = `${api}/api/teachers/${id}`;

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
  
    const url = `${api}/api/teachers/${schoolId}/teachers`;
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
    teacherData: IUpdateTeacherRequestBody,
  ): Promise<boolean> => {
    if (!sessionToken) {
      console.error('Session token is not found. Please log in.');
      return false;
    }

    const url = `${api}/api/teachers/${id}`;
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
