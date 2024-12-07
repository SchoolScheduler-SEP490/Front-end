import useNotify from "@/hooks/useNotify";
import { deleteTeachableSubject } from "../_libs/apiTeacher";
import { useAppContext } from "@/context/app_provider";

const useDeleteTeachableSubject = () => {
  const { sessionToken, schoolId } = useAppContext();

  const handleDeleteTeachableSubject = async (subjectId: number) => {
    try {
      await deleteTeachableSubject(subjectId, schoolId, sessionToken);
      useNotify({
        message: "Xóa chuyên môn thành công!",
        type: "success",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete teacher with ID: ${subjectId}`, error);
      useNotify({
        message: "Xóa chuyên môn thất bại. Vui lòng thử lại!",
        type: "error",
      });
      return false;
    }
  };
  return { handleDeleteTeachableSubject };
};
export default useDeleteTeachableSubject;
