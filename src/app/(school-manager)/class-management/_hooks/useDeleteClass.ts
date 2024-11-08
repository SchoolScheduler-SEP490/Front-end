import useNotify from "@/hooks/useNotify";
import { deleteClassById } from "../_libs/apiClass";
import { useAppContext } from "@/context/app_provider";

const useDeleteClass = () => {
  const { sessionToken, schoolId, selectedSchoolYearId } = useAppContext();

  const deleteClass = async (classId: number) => {
    try {
      await deleteClassById(classId, sessionToken, schoolId, selectedSchoolYearId);
      useNotify({
        message: "Xóa lớp học thành công!",
        type: "success",
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete class with ID: ${classId}`, error);
      useNotify({
        message: "Xóa lớp học thất bại. Vui lòng thử lại!",
        type: "error",
      });
      return false;
    }
  };

  return { deleteClass };
};

export default useDeleteClass;
