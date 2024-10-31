import { addRoom } from "../_libs/apiRoom";
import { IAddRoomData } from "../_libs/constants";
import useNotify from "@/hooks/useNotify";

interface IAddRoomProps {
    schoolId: string;
    sessionToken: string;
    formData: IAddRoomData[];
}

const useAddRoom = async (props: IAddRoomProps) => {
    const { schoolId, formData, sessionToken } = props;
    try {
        const response = await addRoom(schoolId, sessionToken, formData[0]);
        useNotify({
            message: 'Thêm phòng học thành công',
            type: 'success',
        });
        return response;
    } catch (err: any) {
        if (err.message?.includes('already exists')) {
            useNotify({
                message: 'Phòng học này đã tồn tại. Vui lòng thử lại.',
                type: 'error',
            });
            return;
        }
        useNotify({
            message: 'Thêm phòng học thất bại. Vui lòng thử lại.',
            type: 'error',
        });
    }
}

export default useAddRoom;
