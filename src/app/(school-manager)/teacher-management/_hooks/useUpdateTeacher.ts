import { useState } from "react";
import { updateTeacher } from "../_libs/apiTeacher";
import { useAppContext } from "@/context/app_provider";
import { IUpdateTeacherRequestBody } from "../_libs/constants";

export function useUpdateTeacher(mutate: () => void) {
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
  const { sessionToken } = useAppContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const editTeacher = async (teacherId: number, teacherData: IUpdateTeacherRequestBody) => {
    setIsUpdating(true);
    console.log("Attempting to update teacher with ID:", teacherId);
    console.log("Teacher data being sent:", teacherData);

    try {
      if (!sessionToken) {
        throw new Error('Session token not found. Please log in.');
      }
      const success = await updateTeacher(api, teacherId, sessionToken, teacherData);
      if (success) {
        console.log(`Successfully updated teacher:`, teacherData);
        mutate();
      }
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
