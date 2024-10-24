import { useState } from "react";
import { updateTeacher, IUpdateTeacherData } from "../_libs/apiTeacher";
import { useAppContext } from "@/context/app_provider";

export function useUpdateTeacher() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
  const { sessionToken } = useAppContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const editTeacher = async (teacherId: number, teacherData: IUpdateTeacherData) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      if (!sessionToken) {
        throw new Error('Session token not found. Please log in.');
      }
      const success = await updateTeacher(api, teacherId, sessionToken, teacherData);
      console.log(`Successfully updated teacher:`, teacherData);
      setIsUpdating(false);
      return success;
    } catch (error) {
      setUpdateError('Failed to update teacher.');
      console.error('Error updating teacher:', error);
      setIsUpdating(false);
      return false;
    }
  }

  return { editTeacher, isUpdating, updateError };
}
