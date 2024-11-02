import { useState } from "react";
import { useAppContext } from "@/context/app_provider";
import { updateRoom } from "../_libs/apiRoom";
import { IUpdateRoomData } from "../_libs/constants";

export function useUpdateRoom (mutate: () => void ) {
    const { sessionToken } = useAppContext();
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const editRoom = async (roomId: number, roomData: IUpdateRoomData) => {
        setIsUpdating(true);
        try {
            if (!sessionToken) {
                throw new Error('Session token not found. Please log in.');
            }
            const success = await updateRoom(roomId, sessionToken, {
                ...roomData,
                "building-code": "",
                "subjects-abreviation": []
            });
            if (success) {
                mutate();
            }
            setIsUpdating(false);
            return success;
        } catch (error) {
            setUpdateError('Failed to update room.');
            setIsUpdating(false);
            return false;
        }
    }
    return { editRoom, isUpdating, updateError };
}
export default useUpdateRoom;