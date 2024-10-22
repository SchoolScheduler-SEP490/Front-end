import { useState, useEffect, useCallback } from 'react';
import { getTeachers, ITeacherTableData } from '../_libs/apiTeacher';
import { useAppContext } from '@/context/app_provider';

export function useTeacherData() {
  const [teachers, setTeachers] = useState<ITeacherTableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
  const { sessionToken, refreshToken } = useAppContext();

  const schoolId = 2555;
  const includeDeleted = false;
  const pageSize = 10;
  const pageIndex = 1;

  const fetchTeachers = useCallback(async () => {
    try {
      if (!sessionToken) {
        throw new Error('Session token not found. Please log in.');
      }

      const data = await getTeachers(api, schoolId, includeDeleted, pageSize, pageIndex, sessionToken);
      console.log("Fetched Teachers Data:", data);
      setTeachers(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching teacher data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [api, sessionToken, schoolId, includeDeleted, pageSize, pageIndex]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  return { 
    teachers, 
    isLoading,
    error,
    fetchTeachers 
  };
}
