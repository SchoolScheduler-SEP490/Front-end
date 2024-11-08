import { useAppContext } from "@/context/app_provider";
import { addRoom } from "../_libs/apiRoom";
import { IAddRoomData } from "../_libs/constants";
import useNotify from "@/hooks/useNotify";

const useAddRoom = () => {
    const { sessionToken, schoolId } = useAppContext();
  
    const addNewRoom = async (formData: IAddRoomData) => {
      try {
        const response = await addRoom(schoolId, sessionToken, formData);
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
    };
  
    return { addNewRoom };
  };
  
  export default useAddRoom;
