import { useState } from "react";
import { useAppContext } from "@/context/app_provider";
import { updateClass } from "../_libs/apiClass";
import { IUpdateClassData } from "../_libs/constants";
import { CLASSGROUP_STRING_TYPE } from "@/utils/constants";

export function useUpdateClass (mutate: ()=> void ){
    const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
    const { sessionToken } = useAppContext();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const editClass = async (classId: number, classData: IUpdateClassData) => {
        setIsUpdating(true);
        try {
            if (!sessionToken) {
                throw new Error('Session token not found. Please log in.');
            }
            const formattedData = {
                ...classData,
                "school-id": classData["school-id"], // Use schoolId from classData
                "school-year-id": 1, // Add schoolYearId
                grade: Number(classData.grade)
            };
            const success = await updateClass(classId, sessionToken, formattedData);
            if (success) {
                mutate();
            }
            setIsUpdating(false);
            return success;
        } catch (error) {
            setUpdateError('Failed to update class.');
            setIsUpdating(false);
            return false;           
        }

    }      
    return { editClass, isUpdating, updateError };
}