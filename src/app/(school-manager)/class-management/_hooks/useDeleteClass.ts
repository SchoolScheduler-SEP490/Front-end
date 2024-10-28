import useNotify from "@/hooks/useNotify";
import { deleteClassById } from "../_libs/apiClass";

interface IDeleteClassProps {
  classId: number;
  sessionToken: string;
}

const useDeleteClass = async (props: IDeleteClassProps) => {
  const api = process.env.NEXT_PUBLIC_API_URL || "Unknown";
  const { classId, sessionToken } = props;

  try {
    const response = await deleteClassById(classId, sessionToken);
    console.log(`Successfully deleted class with ID: ${classId}`);
    useNotify({
      message: "Xóa lớp thành công!",
      type: "success",
    });
    return response;
  } catch (error) {
    console.error(`Failed to delete class with ID: ${classId}`, error);
    useNotify({
      message: "Xóa lớp thất bại. Vui lòng thử lại!",
      type: "error",
    });
  }
};
export default useDeleteClass;
