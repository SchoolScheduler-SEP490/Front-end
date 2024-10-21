export interface ITeacherTableData {
    id: number;
    teacherCode: string;
    teacherName: string;
    nameAbbreviation: string;
    subjectDepartment: string;
    email: string;
    phoneNumber: string;
    status: string;
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