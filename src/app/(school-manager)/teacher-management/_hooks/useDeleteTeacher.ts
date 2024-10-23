import { useState } from 'react';
import { deleteTeacherById } from '../_libs/apiTeacher';
import { useAppContext } from '@/context/app_provider';

export function useDeleteTeacher() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
  const { sessionToken } = useAppContext(); 

  const deleteTeacher = async (teacherId: number) => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      if (!sessionToken) {
        throw new Error('Session token not found. Please log in.');
      }

      console.log(`Attempting to delete teacher with ID: ${teacherId}`);
      await deleteTeacherById(api, teacherId, sessionToken);
      console.log(`Successfully deleted teacher with ID: ${teacherId}`);
      setIsDeleting(false);
      return true;
    } catch (err) {
      console.error(`Failed to delete teacher with ID: ${teacherId}`, err);
      setDeleteError('Failed to delete teacher.');
      setIsDeleting(false);
      return false;
    }
  };

  return { deleteTeacher, isDeleting, deleteError };
}
