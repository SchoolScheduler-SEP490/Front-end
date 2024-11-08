import useNotify from "@/hooks/useNotify";
import { deleteRoomById } from "../_libs/apiRoom";
import { useAppContext } from "@/context/app_provider";

  const useDeleteRoom = () => {
    const { sessionToken, schoolId } = useAppContext();
  
    const deleteRoom = async (roomId: number) => {
      try {
        await deleteRoomById(roomId, sessionToken, schoolId);
        useNotify({
          message: "Xóa phòng học thành công!",
          type: "success",
        });
        return true;
      } catch (error) {
        console.error(`Failed to delete room with ID: ${roomId}`, error);
        useNotify({
          message: "Xóa phòng học thất bại. Vui lòng thử lại!",
          type: "error",
        });
        return false;
      }
    };
  
    return { deleteRoom };
  };
  
  export default useDeleteRoom;
  