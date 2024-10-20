import { useAppContext } from '@/context/app_provider';
import { useState, useEffect } from 'react';

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


export function useTeacherData() {
  const [teachers, setTeachers] = useState<ITeacherTableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
  const {sessionToken, refreshToken} = useAppContext();

  const schoolId = 2555;
  const includeDeleted = true;
  const pageSize = 10;
  const pageIndex = 1;

  const fetchTeachers = async () => {
    try {
      if (!sessionToken) {
        throw new Error('Session token not found. Please log in.');
      }

      const url = `${api}/api/teachers?schoolId=${schoolId}&includeDeleted=${includeDeleted}&pageSize=${pageSize}&pageIndex=${pageIndex}`;
      console.log("Fetching data from:", url);

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
      const formattedTeachers = mapTeacherData(data);
      setTeachers(formattedTeachers);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching teacher data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return { 
    teachers, 
    isLoading,
    error 
  };
  
}

function mapTeacherData(data: any): ITeacherTableData[] {
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
}
