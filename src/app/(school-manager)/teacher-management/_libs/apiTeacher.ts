export interface ITeacherTableData {
    id: number;
    teacherName: string;
    nameAbbreviation: string;
    subjectDepartment: string;
    email: string;
    phoneNumber: string;
    status: string;
  }

  export interface IAddTeacherData {
    "first-name": string;
    "last-name": string;
    abbreviation: string;
    email: string;
    gender: string;
    "department-code": string;
    "date-of-birth": string;
    "teacher-role": string;
    status: string;
    phone: string;
  }

  export interface IUpdateTeacherData {
    "first-name": string;
    "last-name": string;
    abbreviation: string;
    email: string;
    gender: string;
    "department-id": number;
    "date-of-birth": string;
    "school-id": number;
    "teacher-role": string;
    status: string;
    phone: string;
    "is-deleted": boolean;
  }
  
  export const getTeachers = async (
    api: string, 
    schoolId: number, 
    includeDeleted: boolean, 
    pageSize: number, 
    pageIndex: number, 
    sessionToken: string
  ): Promise<ITeacherTableData[]> => {
    
    if (!sessionToken) {
      throw new Error('Session token not found. Please log in.');
    }
  
    const url = `${api}/api/teachers?schoolId=${schoolId}&includeDeleted=${includeDeleted}&pageSize=${pageSize}&pageIndex=${pageIndex}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return mapTeacherData(data);
  };
  
  const mapTeacherData = (data: any): ITeacherTableData[] => {
    if (data.result && Array.isArray(data.result.items)) {
      return data.result.items.map((item: any) => ({
        id: item.id,
        teacherCode: item.id.toString(),
        teacherName: `${item['first-name']} ${item['last-name']}`,
        nameAbbreviation: item.abbreviation,
        subjectDepartment: item['department-name'],
        email: item.email,
        phoneNumber: item.phone || 'N/A',
        status: item.status === 1 ? 'Hoạt động' : 'Vô hiệu'
      }));
    }
    return [];
  };
  
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
    schoolId: number,
    sessionToken: string,
    teacherData: IAddTeacherData
  ): Promise<boolean> => {
    if (!sessionToken) {
      console.error('Session token is not found. Please log in.');
      return false;
    }
  
    const url = `${api}/api/teachers/${schoolId}/teachers`;
    const requestBody = [teacherData];
    console.log('Request Body:', requestBody);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
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
  };  

  export const updateTeacher = async (
    api: string,
    id: number,
    sessionToken: string,
    teacherData: IUpdateTeacherData
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
