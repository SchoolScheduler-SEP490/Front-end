import { useState } from "react";
import { updateClass } from "../_libs/apiClass";
import { useAppContext } from "@/context/app_provider";
import { IUpdateClassData } from "../_libs/constants";

export function useUpdateClass(mutate: () => void) {
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const editClass = async (classId: number, classData: IUpdateClassData) => {
    setIsUpdating(true);
    try {
      if (!sessionToken) {
        throw new Error('Session token not found. Please log in.');
      }

      const success = await updateClass(
        classId, 
        sessionToken, 
        classData,
        schoolId,
        selectedSchoolYearId
      );

      if (success) {
        mutate();
      }
      setIsUpdating(false);
      return success;
    } catch (error) {
      setUpdateError('Failed to update class.');
      console.error('Error updating class:', error);
      setIsUpdating(false);
      return false;
    }
  }

  return { editClass, isUpdating, updateError };
}
