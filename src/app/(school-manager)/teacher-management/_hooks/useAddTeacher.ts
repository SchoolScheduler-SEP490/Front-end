import { useState } from "react";
import { addTeacher, IAddTeacherData } from "../_libs/apiTeacher";
import { useAppContext } from "@/context/app_provider";

export function useAddTeacher() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
  const { sessionToken } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const addNewTeacher = async (schoolId: number, teacherData: IAddTeacherData) => {
    setIsAdding(true);
    setAddError(null);

    try {
      if (!sessionToken) {
        throw new Error('Session token not found. Please log in.');
      }

      await addTeacher(api, schoolId, sessionToken, teacherData);
      console.log(`Successfully added teacher with ID: ${teacherData}`);
      setIsAdding(false);
      return true;
    } catch (err) {
      setAddError('Failed to add new teacher.');
      console.error('Error adding teacher:', err);
      setIsAdding(false);
      return false; 
    }
  };

  return { addNewTeacher, isAdding, addError };
}
