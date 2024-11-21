import useNotify from "@/hooks/useNotify";
import { deleteTeacherById } from "../_libs/apiTeacher";
import { useAppContext } from "@/context/app_provider";

const useDeleteTeacher = () => {
  const { sessionToken, schoolId } = useAppContext();

  const deleteTeacher = async (teacherId: number) => {
    try {
      await deleteTeacherById(teacherId, schoolId, sessionToken);
      useNotify({
        message: "Xóa giáo viên thành công!",
        type: "success",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete teacher with ID: ${teacherId}`, error);
      useNotify({
        message: "Xóa giáo viên thất bại. Vui lòng thử lại!",
        type: "error",
      });
      return false;
    }
  };

  return { deleteTeacher };
};

export default useDeleteTeacher;
