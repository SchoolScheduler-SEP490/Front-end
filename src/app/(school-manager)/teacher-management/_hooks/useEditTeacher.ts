import { useState } from "react";
import { addTeacher, IAddTeacherData } from "../_libs/apiTeacher";
import { useAppContext } from "@/context/app_provider";

export function useEditTeacher (){
    const api = process.env.NEXT_PUBLIC_API_URL || 'Unknown';
    const { sessionToken } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [addError, setAddError] = useState<string | null>(null);

    const editTeacher = async (teacherId: number, teacherData: IAddTeacherData) => {
        setIsEditing(true);
        setAddError(null);

        try {
            if (!sessionToken) {
                throw new Error('Session token not found. Please log in.');
            }
            await addTeacher(api, teacherId, sessionToken, teacherData);
            console.log(`Successfully edited teacher:`, teacherData);
            setIsEditing(false);
            return true;
        } catch (error) {
            setAddError('Failed to edit teacher.');
            console.error('Error editing teacher:', error);
            setIsEditing(false);
            return false;
        }
    }
    return { editTeacher, isEditing, addError };
}
