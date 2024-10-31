import useNotify from "@/hooks/useNotify";
import { deleteRoomById } from "../_libs/apiRoom";

interface IDeleteRoomProps {
    roomId: number;
    sessionToken: string;
  }

  const useDeleteRoom = async (props: IDeleteRoomProps) => {
    const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";
    const { roomId, sessionToken } = props;
  
    try {
      const response = await deleteRoomById(roomId, sessionToken);
      console.log(`Successfully deleted class with ID: ${roomId}`);
      useNotify({
        message: "Xóa phòng học thành công!",
        type: "success",
      });
      return response;
    } catch (error) {
      console.error(`Failed to delete class with ID: ${roomId}`, error);
      useNotify({
        message: "Xóa phòng học thất bại. Vui lòng thử lại!",
        type: "error",
      });
    }
  };
  export default useDeleteRoom;