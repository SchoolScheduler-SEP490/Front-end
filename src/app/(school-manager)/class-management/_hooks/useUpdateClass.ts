import { useState } from "react";
import { useAppContext } from "@/context/app_provider";
import { updateClass } from "../_libs/apiClass";
import { IUpdateClassData } from "../_libs/constants";

export function useUpdateClass (mutate: ()=> void ){
    const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
    const { sessionToken } = useAppContext();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const editClass = async (classId: number, classData: IUpdateClassData) => {
        setIsUpdating(true);
        console.log("Attempting to update class with ID:", classId);
        console.log("Class data being sent:", classData);

        try {
            if (!sessionToken) {
                throw new Error('Session token not found. Please log in.');
            }
            const success = await updateClass(classId, sessionToken, classData);
            if (success) {
              console.log(`Successfully updated teacher:`, classData);
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
    return { editClass, isUpdating, updateError };
}